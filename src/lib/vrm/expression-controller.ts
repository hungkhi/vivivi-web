/**
 * Expression controller for VRM models.
 *
 * Manages autonomous micro-expressions (blinking, smiling, ambient facial
 * movements) and lip-sync mouth openness. Ported from the original
 * index.html with identical timing and easing logic.
 */

import type { VRM } from '@pixiv/three-vrm';

// ---------------------------------------------------------------------------
// Internal handle type for cancellable animation loops
// ---------------------------------------------------------------------------

interface AnimationHandle {
  cancel: () => void;
  clear?: () => void;
}

// ---------------------------------------------------------------------------
// ExpressionController
// ---------------------------------------------------------------------------

export class ExpressionController {
  private vrm: VRM | null = null;

  private blinkHandle: AnimationHandle | null = null;
  private smileHandle: AnimationHandle | null = null;
  private ambientHandle: AnimationHandle | null = null;

  /** Smoothed mouth lerp value (persists across calls) */
  private mouthLerp = 0;

  /** Timestamp (ms) until which speech is considered active. Used to
   *  accelerate blink frequency while talking. */
  private speechActiveUntil = 0;

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /** Begin all autonomous expressions on the given VRM. */
  startAll(vrm: VRM): void {
    this.dispose();
    this.vrm = vrm;
    this.startRandomBlinking(vrm);
    this.startRandomSmiling(vrm);
    this.startAmbientMicroExpressions(vrm);
  }

  // -----------------------------------------------------------------------
  // Blinking
  // -----------------------------------------------------------------------

  startRandomBlinking(vrm: VRM): void {
    if (!vrm?.expressionManager) return;
    this.stopRandomBlinking();

    const targetVrm = vrm;
    const blinkExpressions = [
      'blink',
      'blinkLeft',
      'blinkRight',
      'Blink',
      'eyesClosed',
    ];

    let blinkAnimationFrame: number | null = null;
    let blinkStartTime = 0;
    let isBlinking = false;

    const animateBlink = (timestamp: number): void => {
      if (!isBlinking) {
        blinkAnimationFrame = requestAnimationFrame(animateBlink);
        return;
      }

      const elapsed = (timestamp - blinkStartTime) / 1000;
      const blinkDuration = 0.15;

      if (elapsed < blinkDuration) {
        let blinkProgress: number;
        if (elapsed < blinkDuration / 2) {
          blinkProgress =
            0.5 * (1 - Math.cos((Math.PI * elapsed) / (blinkDuration / 2)));
        } else {
          const openElapsed = elapsed - blinkDuration / 2;
          blinkProgress =
            0.5 *
            (1 + Math.cos((Math.PI * openElapsed) / (blinkDuration / 2)));
        }

        const currentBlinkValue = Math.min(1.0, blinkProgress);
        if (targetVrm?.expressionManager) {
          for (const blinkName of blinkExpressions) {
            try {
              targetVrm.expressionManager.setValue(blinkName, currentBlinkValue);
            } catch {
              /* expression may not exist */
            }
          }
        }

        blinkAnimationFrame = requestAnimationFrame(animateBlink);
      } else {
        isBlinking = false;
        if (targetVrm?.expressionManager) {
          for (const blinkName of blinkExpressions) {
            try {
              targetVrm.expressionManager.setValue(blinkName, 0.0);
            } catch {
              /* expression may not exist */
            }
          }
        }
      }
    };

    blinkAnimationFrame = requestAnimationFrame(animateBlink);

    const performBlink = (): void => {
      if (!targetVrm?.expressionManager || isBlinking) return;
      isBlinking = true;
      blinkStartTime = performance.now();
    };

    let scheduleTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleBlink = (): void => {
      // Blink more often during speech (1-2s) vs idle (1-3s)
      const speaking = performance.now() < this.speechActiveUntil;
      const randomInterval = speaking
        ? (Math.random() * 1 + 1) * 1000
        : (Math.random() * 2 + 1) * 1000;

      scheduleTimeout = setTimeout(() => {
        performBlink();
        scheduleBlink();
      }, randomInterval);
    };

    scheduleBlink();

    this.blinkHandle = {
      cancel: () => {
        if (blinkAnimationFrame != null)
          cancelAnimationFrame(blinkAnimationFrame);
        if (scheduleTimeout != null) clearTimeout(scheduleTimeout);
      },
    };
  }

  private stopRandomBlinking(): void {
    if (this.blinkHandle) {
      this.blinkHandle.cancel();
      this.blinkHandle = null;
    }
  }

  // -----------------------------------------------------------------------
  // Smiling
  // -----------------------------------------------------------------------

  startRandomSmiling(vrm: VRM): void {
    if (!vrm?.expressionManager) return;
    this.stopRandomSmiling();

    const targetVrm = vrm;
    const smileExpressions = [
      'happy',
      'joy',
      'Joy',
      'smile',
      'Smile',
      'fun',
      'relaxed',
      'smileOpen',
    ];

    let smileAnimationFrame: number | null = null;
    let smileStartTime = 0;
    let isSmiling = false;
    let phase: 'in' | 'hold' | 'out' = 'in';

    const durations = { in: 0.3, hold: 0.25, out: 0.3 };
    const maxSmile = 0.22;

    const setSmileValue = (v: number): void => {
      if (targetVrm?.expressionManager) {
        for (const n of smileExpressions) {
          try {
            targetVrm.expressionManager.setValue(n, v);
          } catch {
            /* expression may not exist */
          }
        }
      }
    };

    const animateSmile = (timestamp: number): void => {
      if (!isSmiling) {
        smileAnimationFrame = requestAnimationFrame(animateSmile);
        return;
      }

      const t = (timestamp - smileStartTime) / 1000;
      let value = 0.0;

      if (phase === 'in') {
        const p = Math.min(1, t / durations.in);
        value = 0.5 * (1 - Math.cos(Math.PI * p));
        if (p >= 1) {
          phase = 'hold';
          smileStartTime = timestamp;
        }
      } else if (phase === 'hold') {
        value = 1.0;
        if (t >= durations.hold) {
          phase = 'out';
          smileStartTime = timestamp;
        }
      } else {
        const p = Math.min(1, t / durations.out);
        value = 1 - 0.5 * (1 - Math.cos(Math.PI * p));
        if (p >= 1) {
          isSmiling = false;
          value = 0.0;
        }
      }

      const clamped = Math.max(0, Math.min(1, value));
      setSmileValue(maxSmile * clamped);
      smileAnimationFrame = requestAnimationFrame(animateSmile);
    };

    smileAnimationFrame = requestAnimationFrame(animateSmile);

    const performSmile = (): void => {
      if (!targetVrm?.expressionManager || isSmiling) return;
      isSmiling = true;
      phase = 'in';
      smileStartTime = performance.now();
    };

    let smileScheduleTimeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleSmile = (): void => {
      const intervalMs = (Math.random() * 5 + 5) * 1000; // 5-10s
      smileScheduleTimeout = setTimeout(() => {
        performSmile();
        scheduleSmile();
      }, intervalMs);
    };

    scheduleSmile();

    this.smileHandle = {
      cancel: () => {
        if (smileAnimationFrame != null)
          cancelAnimationFrame(smileAnimationFrame);
        if (smileScheduleTimeout != null) clearTimeout(smileScheduleTimeout);
      },
      clear: () => setSmileValue(0.0),
    };
  }

  private stopRandomSmiling(): void {
    if (this.smileHandle) {
      try {
        this.smileHandle.clear?.();
      } catch {
        /* ignore */
      }
      this.smileHandle.cancel();
      this.smileHandle = null;
    }
  }

  // -----------------------------------------------------------------------
  // Ambient micro-expressions
  // -----------------------------------------------------------------------

  startAmbientMicroExpressions(vrm: VRM): void {
    if (!vrm?.expressionManager) return;
    this.stopAmbientMicroExpressions();

    const targetVrm = vrm;
    const positiveCandidates = [
      'happy',
      'joy',
      'fun',
      'relaxed',
      'lowered',
      'raised',
      'ee',
      'oh',
      'aa',
      'ih',
      'ou',
    ];

    let raf: number | null = null;
    let active = false;
    let startTime = 0;
    let duration = 0.6;
    let maxIntensity = 0.15;
    let targetNames: string[] = [];
    let phase: 'in' | 'hold' | 'out' = 'in';

    const setValues = (v: number): void => {
      if (targetVrm?.expressionManager) {
        for (const n of targetNames) {
          try {
            targetVrm.expressionManager.setValue(n, v);
          } catch {
            /* expression may not exist */
          }
        }
      }
    };

    const chooseTargets = (): string[] => {
      const count = Math.random() < 0.65 ? 1 : 2;
      const picks: string[] = [];
      const pool = positiveCandidates.slice();
      while (picks.length < count && pool.length > 0) {
        const i = (Math.random() * pool.length) | 0;
        picks.push(pool.splice(i, 1)[0]);
      }
      return picks;
    };

    const animate = (ts: number): void => {
      if (!active) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const t = (ts - startTime) / 1000;
      let value = 0.0;

      const inDur = duration * 0.35;
      const holdDur = duration * 0.3;
      const outDur = duration * 0.35;

      if (phase === 'in') {
        const p = Math.min(1, t / inDur);
        value = 0.5 * (1 - Math.cos(Math.PI * p));
        if (p >= 1) {
          phase = 'hold';
          startTime = ts;
        }
      } else if (phase === 'hold') {
        value = 1.0;
        if (t >= holdDur) {
          phase = 'out';
          startTime = ts;
        }
      } else {
        const p = Math.min(1, t / outDur);
        value = 1 - 0.5 * (1 - Math.cos(Math.PI * p));
        if (p >= 1) {
          active = false;
          value = 0.0;
        }
      }

      setValues(maxIntensity * Math.max(0, Math.min(1, value)));
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const trigger = (): void => {
      if (!targetVrm?.expressionManager || active) return;
      targetNames = chooseTargets();
      maxIntensity = 0.07 + Math.random() * 0.13; // 0.07-0.20
      duration = 0.5 + Math.random() * 0.7; // 0.5-1.2s
      phase = 'in';
      active = true;
      startTime = performance.now();
    };

    let ambientScheduleTimeout: ReturnType<typeof setTimeout> | null = null;

    const schedule = (): void => {
      const interval = (Math.random() * 4 + 3.5) * 1000; // 3.5-7.5s
      ambientScheduleTimeout = setTimeout(() => {
        trigger();
        schedule();
      }, interval);
    };

    schedule();

    this.ambientHandle = {
      cancel: () => {
        if (raf != null) cancelAnimationFrame(raf);
        if (ambientScheduleTimeout != null)
          clearTimeout(ambientScheduleTimeout);
      },
      clear: () => setValues(0.0),
    };
  }

  private stopAmbientMicroExpressions(): void {
    if (this.ambientHandle) {
      try {
        this.ambientHandle.clear?.();
      } catch {
        /* ignore */
      }
      this.ambientHandle.cancel();
      this.ambientHandle = null;
    }
  }

  // -----------------------------------------------------------------------
  // Lip sync
  // -----------------------------------------------------------------------

  /**
   * Set mouth openness for lip-sync.
   *
   * @param v  Raw amplitude value in [0..1]. Internally amplified with gain
   *           and gamma for realistic movement, then smoothed with lerp.
   */
  setMouthOpenness(v: number): void {
    try {
      const raw = Math.max(0, Math.min(1, Number(v) || 0));

      // Gain and soft gamma curve
      const gain = 3.0;
      const gamma = 0.65;
      const biased = Math.pow(Math.min(1, raw * gain), gamma);

      // Fast lerp for responsive lip-sync
      this.mouthLerp = 0.15 * this.mouthLerp + 0.85 * biased;

      // Mark speech as active for blink scheduling
      if (raw > 0.02) {
        this.speechActiveUntil = performance.now() + 900;
      }

      const vrm = this.vrm;
      if (!vrm?.expressionManager) return;

      // Allow a bigger apparent opening, then clamp
      const main = Math.max(0, Math.min(1, this.mouthLerp * 1.35));

      // Primary mouth shape map
      const map: [string, number][] = [
        ['aa', main],
        ['ee', main * 0.8],
        ['ih', main * 0.75],
        ['oh', Math.min(1, main * 1.1)],
        ['ou', Math.min(1, main * 1.05)],
        ['teethOpen', main * 0.6],
      ];

      for (const [n, val] of map) {
        try {
          vrm.expressionManager.setValue(n, val);
        } catch {
          /* expression may not exist */
        }
      }

      // Fallback vowel keys used by some rigs (A, E, I, O, U)
      const upperMap: [string, number][] = [
        ['A', main],
        ['E', main * 0.8],
        ['I', main * 0.75],
        ['O', Math.min(1, main * 1.1)],
        ['U', Math.min(1, main * 1.05)],
      ];

      for (const [n, val] of upperMap) {
        try {
          vrm.expressionManager.setValue(n, val);
        } catch {
          /* expression may not exist */
        }
      }
    } catch {
      /* guard against unexpected errors */
    }
  }

  // -----------------------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------------------

  /** Cancel all running intervals, timeouts, and animation frames. */
  dispose(): void {
    this.stopRandomBlinking();
    this.stopRandomSmiling();
    this.stopAmbientMicroExpressions();
    this.mouthLerp = 0;
    this.speechActiveUntil = 0;
    this.vrm = null;
  }
}
