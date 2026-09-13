// Web Audio API authentic Temple Bell and Rudraksha Bead Synthesizer

class TempleAudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Soft Tactile Rudraksha Bead Click
  public playBeadClick(soundEnabled = true) {
    if (!soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback safe
    }
  }

  // 2. Authentic Harmonic Temple Bell (Brass Ghanta - 108 Completion)
  public playTempleBell(soundEnabled = true) {
    if (!soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Authentic temple bronze bell frequencies (Fundamental 432 Hz + inharmonic metal partials)
      const partials = [
        { freq: 432, gain: 0.35, decay: 3.5 }, // Fundamental
        { freq: 540, gain: 0.22, decay: 2.8 }, // Tierce
        { freq: 864, gain: 0.28, decay: 2.5 }, // Octave
        { freq: 1180, gain: 0.18, decay: 2.0 }, // Quint
        { freq: 1728, gain: 0.12, decay: 1.4 }, // Super-octave shimmer
        { freq: 2400, gain: 0.08, decay: 0.9 }, // Strike transient
      ];

      partials.forEach(({ freq, gain: targetGain, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Instant crisp strike attack, then long lingering singing bowl decay
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.004);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch {
      // Audio fallback safe
    }
  }

  // 3. Auspicious Divine Shankh (Conch Shell Celebration)
  public playConchCall(soundEnabled = true) {
    if (!soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(392, now + 0.6);
      osc.frequency.linearRampToValueAtTime(440, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      // Warm lowpass filter to simulate natural conch horn resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch {
      // Audio fallback safe
    }
  }
}

export const templeAudio = new TempleAudioEngine();
