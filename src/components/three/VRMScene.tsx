'use client';

/**
 * VRMScene -- React component that renders a VRM character in a Three.js
 * canvas. Uses dynamic import to avoid SSR issues with Three.js.
 *
 * Props:
 *  - characterModelUrl: URL of the .vrm model to load.
 *  - animationUrl:      URL of an .fbx animation to apply.
 *  - callMode:          When true the camera zooms to the head.
 *  - onSceneReady:      Callback that receives the VRMSceneManager instance
 *                       so the parent can call triggerLove(), etc.
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

// ---------------------------------------------------------------------------
// Lazy import type -- the actual class is loaded dynamically at runtime.
// ---------------------------------------------------------------------------
import type { VRMSceneManager } from '@/lib/vrm/scene-manager';

// ---------------------------------------------------------------------------
// Public handle exposed via ref
// ---------------------------------------------------------------------------

export interface VRMSceneHandle {
  /** The underlying scene manager (available after mount). */
  manager: VRMSceneManager | null;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface VRMSceneProps {
  /** URL of the VRM model to load. Changes trigger a new model load. */
  characterModelUrl?: string;
  /** URL of an FBX animation to apply. Changes trigger a new animation. */
  animationUrl?: string;
  /** Enable / disable call-mode (close-up head framing). */
  callMode?: boolean;
  /** Optional callback fired when the scene manager is ready. */
  onSceneReady?: (manager: VRMSceneManager) => void;
  /** Optional CSS class name for the wrapper div. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const VRMScene = forwardRef<VRMSceneHandle, VRMSceneProps>(function VRMScene(
  { characterModelUrl, animationUrl, callMode = false, onSceneReady, className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<VRMSceneManager | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Expose the manager via imperative handle
  useImperativeHandle(
    ref,
    () => ({
      get manager() {
        return managerRef.current;
      },
    }),
    [],
  );

  // -----------------------------------------------------------------------
  // Mount: dynamically import Three.js modules and create the scene manager
  // -----------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;

    // Dynamic import to prevent SSR bundling of Three.js
    import('@/lib/vrm/scene-manager').then(({ VRMSceneManager }) => {
      if (disposed) return;

      const manager = new VRMSceneManager(canvas, container);

      manager.setLoadingCallback({
        onStart: () => {
          setLoading(true);
          setProgress(0);
          setError(null);
        },
        onProgress: (pct: number) => {
          setProgress(Math.max(0, Math.min(100, Math.round(pct))));
        },
        onComplete: () => {
          setLoading(false);
        },
        onError: (err: Error) => {
          setError(err.message);
          setLoading(false);
        },
      });

      managerRef.current = manager;
      onSceneReady?.(manager);
    });

    return () => {
      disposed = true;
      if (managerRef.current) {
        managerRef.current.dispose();
        managerRef.current = null;
      }
    };
    // Only run on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // React to prop changes: model URL
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!characterModelUrl) return;
    const manager = managerRef.current;
    if (!manager) {
      // Manager not yet initialised -- retry once after a short delay
      const timer = setTimeout(() => {
        managerRef.current?.loadModel(characterModelUrl);
      }, 300);
      return () => clearTimeout(timer);
    }
    manager.loadModel(characterModelUrl);
  }, [characterModelUrl]);

  // -----------------------------------------------------------------------
  // React to prop changes: animation URL
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!animationUrl) return;
    const manager = managerRef.current;
    if (!manager) {
      const timer = setTimeout(() => {
        managerRef.current?.loadAnimation(animationUrl);
      }, 300);
      return () => clearTimeout(timer);
    }
    manager.loadAnimation(animationUrl);
  }, [animationUrl]);

  // -----------------------------------------------------------------------
  // React to prop changes: call mode
  // -----------------------------------------------------------------------

  useEffect(() => {
    managerRef.current?.setCallMode(callMode);
  }, [callMode]);

  // -----------------------------------------------------------------------
  // Container resize observer (catches layout shifts, not just window resize)
  // -----------------------------------------------------------------------

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      managerRef.current?.resize();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'rgba(0, 0, 0, 0.25)',
            zIndex: 10,
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          }}
        >
          {/* Spinner SVG identical to original */}
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#fff"
          >
            <g fill="none" fillRule="evenodd" strokeWidth="4">
              <circle cx="22" cy="22" r="18" strokeOpacity="0.3" />
              <path d="M40 22c0-9.94-8.06-18-18-18" stroke="#fff">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 22 22"
                  to="360 22 22"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </svg>
          <div style={{ marginTop: 12, fontSize: 16 }}>
            Loading... {progress}%
          </div>
        </div>
      )}

      {/* Error display */}
      {error && !loading && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(220, 38, 38, 0.85)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            zIndex: 10,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
});

export default VRMScene;
