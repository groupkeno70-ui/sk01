// @ts-nocheck
/**
 * Professional Ultra-Crisp Web Audio API Sound Engine for Teen Patti.
 * Provides user-friendly, satisfying acoustic feedback and ambient lounge audio.
 */
export class TeenPattiAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;
  private musicAudio: HTMLAudioElement | null = null;
  private bgmRequestId = 0;
  private readonly mp3BasePath = "/audio-music/teenpatti/";
  private readonly customMp3Files = new Set<string>();

  constructor() {
    if (typeof window !== "undefined") {
      [
        "click.mp3",
        "chip.mp3",
        "tick.mp3",
        "countdown.mp3",
        "deal.mp3",
        "flip.mp3",
        "win.mp3",
        "lose.mp3",
        "bgm.mp3",
      ].forEach((fileName) => {
        fetch(`${this.mp3BasePath}${fileName}`, { method: "HEAD" })
          .then((response) => {
            const contentType = response.headers.get("content-type") || "";
            if (response.ok && contentType.toLowerCase().startsWith("audio/")) {
              this.customMp3Files.add(fileName);
            }
          })
          .catch(() => {});
      });
    }
  }

  private playMp3(fileName: string, volume = 1): boolean {
    if (typeof window === "undefined") return false;
    const paths = [`/audio/teenpatti/${fileName}`, `/audio-music/teenpatti/${fileName}`];
    const audio = new Audio(paths[0]);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = "auto";
    audio.play().catch(() => {
      const fallback = new Audio(paths[1]);
      fallback.volume = Math.max(0, Math.min(1, volume));
      fallback.play().catch(() => {});
    });
    return true;
  }

  private hasCustomMp3(fileName: string): boolean {
    return this.customMp3Files.has(fileName);
  }

  private init() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (this.ctx && !this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 1;
      this.musicGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  // 1. Soft User-Friendly Button Click
  public playClick() {
    if (this.hasCustomMp3("click.mp3")) {
      this.playMp3("click.mp3", 0.75);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. Ultra-Satisfying Ceramic Poker Chip Clack
  public playChip() {
    if (this.hasCustomMp3("chip.mp3")) {
      this.playMp3("chip.mp3", 0.9);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Resonant clay strike
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(2600, now);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.04);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Subtle table echo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.015);
    osc2.frequency.exponentialRampToValueAtTime(220, now + 0.06);
    gain2.gain.setValueAtTime(0.10, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.015);
    osc2.stop(now + 0.06);
  }

  // 3. Smooth Clock Pulse Tick
  public playTick() {
    if (this.hasCustomMp3("tick.mp3")) {
      this.playMp3("tick.mp3", 0.65);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  // 4. Futuristic High-Stakes Countdown Chime (for 3, 2, 1)
  public playWarningBeep(count: number) {
    // Play the single three-second file once when the timer reaches 3.
    if (count !== 3) return;
    if (this.hasCustomMp3("countdown.mp3")) {
      this.playMp3("countdown.mp3", 0.9);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    const pitches = { 3: 880, 2: 1108.73, 1: 1396.91 }; // A5, C#6, F6
    const baseFreq = pitches[count] || 1046.5;

    // Harmonic bell bell sound
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(baseFreq, now);
    gain1.gain.setValueAtTime(0.16, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Sparkle octave
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    gain2.gain.setValueAtTime(0.06, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.15);
  }

  // 5. Smooth Velvet Card Deal Whoosh
  public playDealCard() {
    if (this.hasCustomMp3("deal.mp3")) {
      this.playMp3("deal.mp3", 0.8);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 6. Crisp Air-Friction Card Flip
  public playCardFlip() {
    if (this.hasCustomMp3("flip.mp3")) {
      this.playMp3("flip.mp3", 0.85);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.045);

    gain.gain.setValueAtTime(0.10, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // 7. Grand Victory Fanfare + Golden Coin Cascade
  public playWin() {
    if (this.hasCustomMp3("win.mp3")) {
      this.playMp3("win.mp3", 1);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Uplifting Major Triad Melody
    const notes = [
      { f: 523.25, t: 0,    d: 0.14 }, // C5
      { f: 659.25, t: 0.09, d: 0.14 }, // E5
      { f: 783.99, t: 0.18, d: 0.16 }, // G5
      { f: 1046.5, t: 0.28, d: 0.35 }, // C6
      { f: 1318.5, t: 0.40, d: 0.45 }, // E6
      { f: 1567.9, t: 0.52, d: 0.60 }, // G6 (Grand finish)
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.15, now + t);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + d);
    });

    // Metallic Coin Cascade Chimes
    for (let i = 0; i < 4; i++) {
      const coinTime = now + 0.2 + i * 0.08;
      const coinOsc = ctx.createOscillator();
      const coinGain = ctx.createGain();
      coinOsc.type = "triangle";
      coinOsc.frequency.setValueAtTime(3200 + i * 400, coinTime);
      coinGain.gain.setValueAtTime(0.05, coinTime);
      coinGain.gain.exponentialRampToValueAtTime(0.0001, coinTime + 0.08);
      coinOsc.connect(coinGain).connect(ctx.destination);
      coinOsc.start(coinTime);
      coinOsc.stop(coinTime + 0.08);
    }

    // Trigger explosive fireworks bursts
    this.playFireworksSequence();
  }

  // 10. Fireworks Crackling Burst (আতশবাজি ফুটার মতো শব্দ)
  public playFireworksBurst() {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    // A. Rocket Launch Whoosh
    const whooshOsc = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    whooshOsc.type = "sine";
    whooshOsc.frequency.setValueAtTime(280, now);
    whooshOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.16);
    whooshGain.gain.setValueAtTime(0.08, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    whooshOsc.connect(whooshGain).connect(ctx.destination);
    whooshOsc.start(now);
    whooshOsc.stop(now + 0.16);

    // B. Main Explosion Boom (Low Punch)
    const boomTime = now + 0.16;
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = "triangle";
    boomOsc.frequency.setValueAtTime(180, boomTime);
    boomOsc.frequency.exponentialRampToValueAtTime(35, boomTime + 0.35);
    boomGain.gain.setValueAtTime(0.28, boomTime);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.35);
    boomOsc.connect(boomGain).connect(ctx.destination);
    boomOsc.start(boomTime);
    boomOsc.stop(boomTime + 0.35);

    // C. Noise Burst (Cracker Blast)
    try {
      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(900, boomTime);
      noiseFilter.Q.setValueAtTime(1.8, boomTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22, boomTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.25);
      noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
      noise.start(boomTime);
      noise.stop(boomTime + 0.25);
    } catch (e) {}

    // D. Crackling Sparkles (আতশবাজির পটকা ফোটার শব্দ)
    for (let i = 0; i < 8; i++) {
      const sparkleTime = boomTime + 0.06 + Math.random() * 0.32;
      const spkOsc = ctx.createOscillator();
      const spkGain = ctx.createGain();
      spkOsc.type = "square";
      spkOsc.frequency.setValueAtTime(2200 + Math.random() * 2600, sparkleTime);
      spkGain.gain.setValueAtTime(0.05, sparkleTime);
      spkGain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + 0.025);
      spkOsc.connect(spkGain).connect(ctx.destination);
      spkOsc.start(sparkleTime);
      spkOsc.stop(sparkleTime + 0.025);
    }
  }

  // Multi-burst fireworks series
  public playFireworksSequence() {
    this.playFireworksBurst();
    setTimeout(() => this.playFireworksBurst(), 350);
    setTimeout(() => this.playFireworksBurst(), 750);
    setTimeout(() => this.playFireworksBurst(), 1150);
  }

  // 8. Gentle Loss Tone
  public playLose() {
    if (this.hasCustomMp3("lose.mp3")) {
      this.playMp3("lose.mp3", 0.85);
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 9. Ambient Chill Lounge BGM
  public toggleBgm(enable: boolean) {
    const requestId = ++this.bgmRequestId;
    if (!enable) {
      if (this.musicInterval) {
        clearInterval(this.musicInterval);
        this.musicInterval = null;
      }
      if (this.musicAudio) {
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
        this.musicAudio = null;
      }
      if (this.musicGain) this.musicGain.gain.value = 0;
      this.isMusicPlaying = false;
      return;
    }

    if (this.isMusicPlaying) return;

    if (typeof window !== "undefined") {
      const audio = new Audio(`${this.mp3BasePath}bgm.mp3`);
      this.musicAudio = audio;
      audio.loop = true;
      audio.volume = 0.25;
      audio.addEventListener("error", () => {
        if (this.bgmRequestId === requestId && this.musicAudio === audio) {
          audio.pause();
          this.musicAudio = null;
          this.isMusicPlaying = false;
          this.playGeneratedBgm();
        }
      }, { once: true });
      audio.load();
      audio.play().then(() => {
        if (this.bgmRequestId !== requestId || this.musicAudio !== audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }).catch(() => {
        if (this.bgmRequestId === requestId && this.musicAudio === audio) {
          audio.pause();
          this.musicAudio = null;
          this.isMusicPlaying = false;
          this.playGeneratedBgm();
        }
      });
      this.isMusicPlaying = true;
      return;
    }

    this.playGeneratedBgm();
  }

  private playGeneratedBgm() {
    const ctx = this.init();
    if (!ctx) return;
    if (this.musicGain) this.musicGain.gain.value = 1;
    this.isMusicPlaying = true;

    // Soothing Neo-Soul Chill Chords
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];
    let step = 0;

    const playChord = () => {
      if (!this.isMusicPlaying) return;
      const now = ctx.currentTime;
      const current = chords[step % chords.length];
      step++;

      current.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        gain.gain.setValueAtTime(0.012, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
        osc.connect(gain).connect(this.musicGain!);
        osc.start(now + idx * 0.04);
        osc.stop(now + 1.9);
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 2200);
  }
}

export const teenPattiAudio = new TeenPattiAudioEngine();