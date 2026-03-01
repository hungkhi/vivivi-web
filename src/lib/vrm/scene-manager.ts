/**
 * VRM Scene Manager.
 *
 * Encapsulates the entire Three.js scene lifecycle: renderer, camera,
 * controls, lighting, VRM model loading with progress, FBX animation
 * playback with cross-fading, background management, call-mode camera,
 * love / dance triggers, and lip-sync forwarding.
 *
 * Ported faithfully from the original monolithic index.html.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import type { VRM } from '@pixiv/three-vrm';

import { loadHumanoidAnimation } from './animation-loader';
import { ExpressionController } from './expression-controller';
import { fbxFiles, FBX_BASE_URL } from './config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeFileNameFromUrl(url: string | null): string | null {
  try {
    if (!url) return null;
    const last = url.split('/').pop() ?? '';
    try {
      return decodeURIComponent(last);
    } catch {
      return last;
    }
  } catch {
    return null;
  }
}

function getDefaultIdleAnimation(): string | null {
  if (!fbxFiles || fbxFiles.length === 0) return null;
  const priorities = [
    /idle/i,
    /stand/i,
    /greet|greeting|hello|wave/i,
    /hand\s*raising/i,
    /talk/i,
  ];
  for (const p of priorities) {
    const match = fbxFiles.find((name) => p.test(name));
    if (match) return match;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoadingCallback {
  onProgress?: (percent: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// ---------------------------------------------------------------------------
// VRMSceneManager
// ---------------------------------------------------------------------------

export class VRMSceneManager {
  // Three.js core
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene: THREE.Scene;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;

  // VRM state
  private currentVrm: VRM | null = null;
  private currentMixer: THREE.AnimationMixer | null = null;
  private currentAction: THREE.AnimationAction | undefined = undefined;
  private currentAnimationUrl: string | null = null;
  private lastUsedAnimationIndex = -1;

  // Expressions
  private expressionController: ExpressionController;

  // Camera smoothing
  private camDesiredPos = new THREE.Vector3(0.0, 1.0, 5.0);
  private camDesiredTarget = new THREE.Vector3(0.0, 1.0, 0.0);
  private callMode = false;
  private tmpVec3 = new THREE.Vector3();

  // Container reference for resize
  private container: HTMLElement;

  // Loading callbacks
  private loadingCallback: LoadingCallback = {};

  // Cache
  private animObjectURLCache = new Map<string, Promise<string>>();

  // Disposed flag
  private disposed = false;

  // -----------------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------------

  constructor(canvas: HTMLCanvasElement, container: HTMLElement) {
    this.container = container;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      30.0,
      container.clientWidth / container.clientHeight,
      0.1,
      20.0,
    );
    this.camera.position.set(0.0, 1.0, 5.0);

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0.0, 1.0, 0.0);
    this.controls.update();
    this.controls.enabled = false;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Lights
    const directional = new THREE.DirectionalLight(0xffffff, Math.PI);
    directional.position.set(1.0, 1.0, 1.0).normalize();
    this.scene.add(directional);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Expression controller
    this.expressionController = new ExpressionController();

    // Clock & start render loop
    this.clock = new THREE.Clock();
    this.animate();

    // Resize listener
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  // -----------------------------------------------------------------------
  // Loading callbacks
  // -----------------------------------------------------------------------

  setLoadingCallback(cb: LoadingCallback): void {
    this.loadingCallback = cb;
  }

  // -----------------------------------------------------------------------
  // Model loading
  // -----------------------------------------------------------------------

  async loadModel(url: string, name?: string): Promise<void> {
    if (this.disposed) return;

    const displayName = name ?? safeFileNameFromUrl(url) ?? 'Model';

    this.loadingCallback.onStart?.();

    return new Promise<void>((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.crossOrigin = 'anonymous';
      loader.register(
        (parser) =>
          new VRMLoaderPlugin(parser, { autoUpdateHumanBones: true }),
      );

      loader.load(
        url,
        (gltf) => {
          try {
            const vrm: VRM = gltf.userData.vrm;

            VRMUtils.removeUnnecessaryVertices(gltf.scene);
            VRMUtils.combineSkeletons(gltf.scene);

            // Clean up old model
            if (this.currentVrm) {
              this.expressionController.dispose();
              this.scene.remove(this.currentVrm.scene);
              VRMUtils.deepDispose(this.currentVrm.scene);
            }

            this.currentVrm = vrm;
            this.scene.add(vrm.scene);

            this.currentMixer = new THREE.AnimationMixer(vrm.scene);
            this.currentAction = undefined;

            vrm.scene.traverse((obj) => {
              obj.frustumCulled = false;
            });

            VRMUtils.rotateVRM0(vrm);

            // Start expressions after a short delay
            setTimeout(() => {
              if (this.currentVrm === vrm) {
                this.expressionController.startAll(vrm);
              }
            }, 500);

            // Auto-load idle animation if nothing is queued
            if (!this.currentAnimationUrl) {
              const idleName = getDefaultIdleAnimation();
              if (idleName) {
                this.getAnimationURL(idleName).then((animUrl) => {
                  if (animUrl && this.currentVrm === vrm) {
                    this.loadFBXInternal(animUrl, idleName, 0.5);
                  }
                });
              }
            } else {
              // Re-apply current animation to the new model
              const animUrl = this.currentAnimationUrl;
              const animName =
                safeFileNameFromUrl(animUrl) ?? 'Animation';
              this.loadFBXInternal(animUrl, animName, 0.5);
            }

            // Update camera framing
            this.updateCameraTargetsForMode();

            this.loadingCallback.onComplete?.();
            resolve();
          } catch (err) {
            this.loadingCallback.onError?.(
              err instanceof Error ? err : new Error(String(err)),
            );
            reject(err);
          }
        },
        (progress) => {
          const percent = progress.total
            ? (100.0 * progress.loaded) / progress.total
            : 0;
          this.loadingCallback.onProgress?.(percent);
        },
        (error) => {
          const err =
            error instanceof Error ? error : new Error('Error loading VRM');
          this.loadingCallback.onError?.(err);
          this.loadingCallback.onComplete?.();
          reject(err);
        },
      );
    });
  }

  // -----------------------------------------------------------------------
  // Animation loading
  // -----------------------------------------------------------------------

  async loadAnimation(url: string, name?: string): Promise<void> {
    const displayName = name ?? safeFileNameFromUrl(url) ?? 'Animation';
    this.loadFBXInternal(url, displayName, 0.5);
  }

  private loadFBXInternal(
    animationUrl: string,
    animationName: string,
    crossFadeDuration = 0.5,
  ): void {
    this.currentAnimationUrl = animationUrl;

    if (!this.currentMixer || !this.currentVrm) return;

    const vrm = this.currentVrm;
    const mixer = this.currentMixer;

    loadHumanoidAnimation(animationUrl, vrm)
      .then((clip) => {
        if (this.currentVrm !== vrm) return; // model changed during load

        const newAction = mixer.clipAction(clip);
        newAction.reset();

        if (this.currentAction && this.currentAction !== newAction) {
          newAction.play();
          this.currentAction.crossFadeTo(newAction, crossFadeDuration, true);
        } else {
          newAction.play();
        }

        this.currentAction = newAction;

        // Ensure expressions are running after animation starts
        setTimeout(() => {
          if (this.currentVrm === vrm) {
            this.expressionController.startAll(vrm);
          }
        }, 200);
      })
      .catch((error) => {
        console.error(`Error loading animation "${animationName}":`, error);
      });
  }

  // -----------------------------------------------------------------------
  // Animation URL caching
  // -----------------------------------------------------------------------

  private async getAnimationURL(name: string): Promise<string> {
    if (this.animObjectURLCache.has(name)) {
      try {
        return await this.animObjectURLCache.get(name)!;
      } catch {
        /* fallthrough to direct URL */
      }
    }

    const remote = FBX_BASE_URL + encodeURIComponent(name);

    // Cache the fetch for future use
    const promise = fetch(remote, { mode: 'cors' })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + name);
        return r.blob();
      })
      .then((blob) => URL.createObjectURL(blob))
      .catch((err) => {
        this.animObjectURLCache.delete(name);
        throw err;
      });

    this.animObjectURLCache.set(name, promise);

    return remote;
  }

  // -----------------------------------------------------------------------
  // Call mode
  // -----------------------------------------------------------------------

  setCallMode(enabled: boolean): void {
    this.callMode = enabled;
    this.updateCameraTargetsForMode();
  }

  private updateCameraTargetsForMode(): void {
    let targetY = 1.0;
    let posZ = this.callMode ? 1.8 : 5.0;
    const fov = this.callMode ? 24.0 : 30.0;

    try {
      if (this.callMode && this.currentVrm?.humanoid) {
        const wp = new THREE.Vector3();
        const head = this.currentVrm.humanoid.getNormalizedBoneNode('head');
        if (head) {
          head.getWorldPosition(wp);
          this.camDesiredTarget.set(wp.x, wp.y, wp.z);
          targetY = wp.y;
        } else {
          this.camDesiredTarget.set(0.0, targetY, 0.0);
        }
      } else {
        this.camDesiredTarget.set(0.0, 1.0, 0.0);
        targetY = 1.0;
      }
    } catch {
      this.camDesiredTarget.set(0.0, 1.0, 0.0);
      targetY = 1.0;
    }

    this.camDesiredPos.set(
      this.camDesiredTarget.x,
      targetY,
      this.camDesiredTarget.z + posZ,
    );
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  // -----------------------------------------------------------------------
  // Background
  // -----------------------------------------------------------------------

  setBackground(imageUrl: string): void {
    // In the web-component world backgrounds are managed via CSS on the
    // container element. This method sets a CSS background-image on the
    // container for easy integration.
    try {
      if (this.container) {
        this.container.style.backgroundImage = `url('${imageUrl}')`;
        this.container.style.backgroundSize = 'cover';
        this.container.style.backgroundPosition = 'center center';
        this.container.style.backgroundRepeat = 'no-repeat';
      }
    } catch {
      /* ignore */
    }
  }

  // -----------------------------------------------------------------------
  // Love / heart effect
  // -----------------------------------------------------------------------

  triggerLove(): void {
    if (!this.currentVrm?.expressionManager) return;

    const vrm = this.currentVrm;
    const names = ['happy', 'joy', 'fun', 'relaxed'];
    const t0 = performance.now();
    const dur = 0.9;
    const maxV = 0.35;

    const setVal = (v: number): void => {
      for (const n of names) {
        try {
          vrm.expressionManager!.setValue(n, v);
        } catch {
          /* expression may not exist */
        }
      }
    };

    const step = (ts: number): void => {
      const t = (ts - t0) / 1000;
      if (t <= dur) {
        const p = t / dur;
        const v =
          p < 0.5
            ? maxV * (0.5 * (1 - Math.cos(Math.PI * (p / 0.5))))
            : maxV *
              (1 - 0.5 * (1 - Math.cos(Math.PI * ((p - 0.5) / 0.5))));
        setVal(Math.max(0, Math.min(maxV, v)));
        requestAnimationFrame(step);
      } else {
        setVal(0.0);
      }
    };

    requestAnimationFrame(step);
  }

  // -----------------------------------------------------------------------
  // Dance trigger
  // -----------------------------------------------------------------------

  triggerDance(): void {
    if (!this.currentVrm || !this.currentMixer) return;

    const nextFBX = this.getNextAnimation();
    if (!nextFBX) return;

    this.getAnimationURL(nextFBX).then((animUrl) => {
      if (animUrl) {
        this.loadFBXInternal(animUrl, nextFBX, 0.8);
      }
    });
  }

  private getNextAnimation(): string | null {
    if (!fbxFiles || fbxFiles.length === 0) return null;
    let attempts = 0;
    let randomIndex: number;
    let randomFBX: string;
    do {
      randomIndex = Math.floor(Math.random() * fbxFiles.length);
      randomFBX = fbxFiles[randomIndex];
      attempts++;
    } while (
      randomIndex === this.lastUsedAnimationIndex &&
      attempts < 10 &&
      fbxFiles.length > 1
    );
    this.lastUsedAnimationIndex = randomIndex;
    return randomFBX;
  }

  // -----------------------------------------------------------------------
  // Lip sync
  // -----------------------------------------------------------------------

  setMouthOpenness(value: number): void {
    this.expressionController.setMouthOpenness(value);
  }

  // -----------------------------------------------------------------------
  // Render loop
  // -----------------------------------------------------------------------

  private animate = (): void => {
    if (this.disposed) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();

    if (this.currentMixer) {
      this.currentMixer.update(deltaTime);
    }
    if (this.currentVrm) {
      this.currentVrm.update(deltaTime);
    }

    // Smooth camera interpolation
    try {
      if (this.callMode && this.currentVrm?.humanoid) {
        const head = this.currentVrm.humanoid.getNormalizedBoneNode('head');
        if (head) {
          head.getWorldPosition(this.tmpVec3);
          const targetY = this.tmpVec3.y;
          this.camDesiredTarget.set(
            this.tmpVec3.x,
            targetY,
            this.tmpVec3.z,
          );
          const zOffset = 1.8;
          const yOffset = 0.05;
          this.camDesiredPos.set(
            this.camDesiredTarget.x,
            targetY + yOffset,
            this.camDesiredTarget.z + zOffset,
          );
        }
      }

      this.camera.position.lerp(this.camDesiredPos, 0.08);
      this.controls.target.lerp(this.camDesiredTarget, 0.12);
      this.controls.update();
    } catch {
      /* ignore */
    }

    this.renderer.render(this.scene, this.camera);
  };

  // -----------------------------------------------------------------------
  // Resize
  // -----------------------------------------------------------------------

  private onResize(): void {
    if (this.disposed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.updateCameraTargetsForMode();
  }

  /** Call this externally if the container size changes outside of a
   *  window resize event (e.g. layout shift). */
  resize(): void {
    this.onResize();
  }

  // -----------------------------------------------------------------------
  // Accessors
  // -----------------------------------------------------------------------

  getVrm(): VRM | null {
    return this.currentVrm;
  }

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------

  dispose(): void {
    this.disposed = true;

    window.removeEventListener('resize', this.onResize);

    if (this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.expressionController.dispose();

    // Dispose VRM
    if (this.currentVrm) {
      this.scene.remove(this.currentVrm.scene);
      VRMUtils.deepDispose(this.currentVrm.scene);
      this.currentVrm = null;
    }

    // Dispose cached object URLs
    for (const promise of this.animObjectURLCache.values()) {
      promise.then((url) => URL.revokeObjectURL(url)).catch(() => {});
    }
    this.animObjectURLCache.clear();

    // Dispose Three.js
    this.controls.dispose();
    this.renderer.dispose();
  }
}
