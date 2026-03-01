/**
 * Animation loader for VRM models.
 *
 * Loads FBX animations and retargets them onto VRM humanoid skeletons
 * using the rig maps and bone-name patterns from config.
 */

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { VRM } from '@pixiv/three-vrm';

import { combinedRigMap, namePatterns } from './config';

// ---------------------------------------------------------------------------
// Bone name resolution
// ---------------------------------------------------------------------------

/**
 * Resolve an arbitrary bone name to its VRM humanoid bone name.
 *
 * Resolution order:
 *  1. Exact key match in the combined rig map.
 *  2. Case-insensitive key match in the combined rig map.
 *  3. Regex pattern match against `namePatterns`.
 *
 * Returns the VRM bone name or `null` when no mapping is found.
 */
export function findBoneMapping(boneName: string): string | null {
  // 1. Exact match
  if (combinedRigMap[boneName]) {
    return combinedRigMap[boneName];
  }

  // 2. Case-insensitive match
  const lowerName = boneName.toLowerCase();
  for (const [key, value] of Object.entries(combinedRigMap)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  // 3. Pattern match
  for (const [vrmBone, pattern] of Object.entries(namePatterns)) {
    if (pattern.test(boneName)) {
      return vrmBone;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Humanoid animation loading
// ---------------------------------------------------------------------------

/**
 * Load an FBX file from `url`, retarget it onto the given `vrm`, and return
 * a ready-to-play `THREE.AnimationClip`.
 *
 * The retargeting adjusts quaternion tracks using the rest-pose inverse and
 * scales hip position tracks to match the VRM's proportions -- identical to
 * the original index.html implementation.
 */
export async function loadHumanoidAnimation(
  url: string,
  vrm: VRM,
): Promise<THREE.AnimationClip> {
  const loader = new FBXLoader();
  loader.crossOrigin = 'anonymous';

  const asset = await loader.loadAsync(url);

  // Pick the animation clip: prefer 'mixamo.com', fall back to first clip.
  let clip = THREE.AnimationClip.findByName(asset.animations, 'mixamo.com');
  if (!clip && asset.animations.length > 0) {
    clip = asset.animations[0];
  }
  if (!clip) {
    throw new Error('No animation found in FBX file');
  }

  const tracks: THREE.KeyframeTrack[] = [];

  const restRotationInverse = new THREE.Quaternion();
  const parentRestWorldRotation = new THREE.Quaternion();
  const _quatA = new THREE.Quaternion();
  const _vec3 = new THREE.Vector3();

  // Find the hips node to compute position scale
  let hipsNode: THREE.Object3D | null = null;
  asset.traverse((node) => {
    if (!hipsNode) {
      const vrmBoneName = findBoneMapping(node.name);
      if (vrmBoneName === 'hips') {
        hipsNode = node;
      }
    }
  });

  let hipsPositionScale = 1.0;
  if (hipsNode) {
    const motionHipsHeight = (hipsNode as THREE.Object3D).position.y;
    const vrmHipsY =
      vrm.humanoid
        ?.getNormalizedBoneNode('hips')
        ?.getWorldPosition(_vec3).y ?? 1;
    const vrmRootY = vrm.scene.getWorldPosition(_vec3).y;
    const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
    if (motionHipsHeight > 0) {
      hipsPositionScale = vrmHipsHeight / motionHipsHeight;
    }
  }

  clip.tracks.forEach((track) => {
    const trackSplitted = track.name.split('.');
    const rigBoneName = trackSplitted[0];
    const vrmBoneName = findBoneMapping(rigBoneName);

    if (!vrmBoneName) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vrmNodeName = vrm.humanoid?.getNormalizedBoneNode(vrmBoneName as any)?.name;
    const rigNode = asset.getObjectByName(rigBoneName);

    if (vrmNodeName != null && rigNode) {
      const propertyName = trackSplitted[1];

      rigNode.getWorldQuaternion(restRotationInverse).invert();
      rigNode.parent!.getWorldQuaternion(parentRestWorldRotation);

      if (track instanceof THREE.QuaternionKeyframeTrack) {
        for (let i = 0; i < track.values.length; i += 4) {
          const flatQuaternion = track.values.slice(i, i + 4);
          _quatA.fromArray(flatQuaternion);
          _quatA
            .premultiply(parentRestWorldRotation)
            .multiply(restRotationInverse);
          _quatA.toArray(flatQuaternion);
          flatQuaternion.forEach((v, index) => {
            track.values[index + i] = v;
          });
        }

        tracks.push(
          new THREE.QuaternionKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            track.values.map((v, i) =>
              vrm.meta?.metaVersion === '0' && i % 2 === 0 ? -v : v,
            ),
          ),
        );
      } else if (track instanceof THREE.VectorKeyframeTrack) {
        const value = track.values.map(
          (v, i) =>
            (vrm.meta?.metaVersion === '0' && i % 3 !== 1 ? -v : v) *
            hipsPositionScale,
        );
        tracks.push(
          new THREE.VectorKeyframeTrack(
            `${vrmNodeName}.${propertyName}`,
            track.times,
            value,
          ),
        );
      }
    }
  });

  return new THREE.AnimationClip('vrmAnimation', clip.duration, tracks);
}
