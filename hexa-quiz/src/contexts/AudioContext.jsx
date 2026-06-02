import { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext();

class HexaAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgNodes = [];
    this.vol = 0.4;
  }

  _init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.vol;
    this.masterGain.connect(this.ctx.destination);
  }

  _osc(freq, type, startGain, duration, startTime = 0) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = this.ctx.currentTime + startTime;
    g.gain.setValueAtTime(startGain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  startBg(mode) {
    this.stopBg();
    this._init();
    if (this.ctx.state === "suspended") this.ctx.resume();

    const configs = {
      kids:   { freqs: [261.63, 392, 523.25, 659.25], types: ["sine","sine","triangle","sine"], interval: 1.2 },
      teens:  { freqs: [220, 293.66, 369.99, 440],    types: ["triangle","sine","triangle","sine"], interval: 1.5 },
      adults: { freqs: [130.81, 164.81, 196, 246.94], types: ["sine","sine","sine","triangle"], interval: 2 },
    };
    const { freqs, types, interval } = configs[mode] || configs.adults;

    freqs.forEach((freq, i) => {
      const playNote = () => {
        if (!this.bgNodes.active) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = types[i];
        osc.frequency.value = freq;
        const t = this.ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.025, t + 0.3);
        g.gain.linearRampToValueAtTime(0.015, t + interval * 0.8);
        g.gain.linearRampToValueAtTime(0, t + interval);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + interval);
        const id = setTimeout(playNote, (interval + i * 0.3) * 1000);
        this.bgNodes.timers.push(id);
      };
      const delay = setTimeout(playNote, i * 300);
      this.bgNodes.timers.push(delay);
    });
  }

  stopBg() {
    if (this.bgNodes.timers) this.bgNodes.timers.forEach(clearTimeout);
    this.bgNodes = { active: false, timers: [] };
    setTimeout(() => { this.bgNodes = { active: true, timers: [] }; }, 10);
  }

  playCorrect() {
    this._init();
    [0, 0.12, 0.24].forEach((delay, i) => {
      const freqs = [523.25, 659.25, 783.99];
      this._osc(freqs[i], "sine", 0.2, 0.3, delay);
    });
  }

  playWrong() {
    this._init();
    this._osc(220, "sawtooth", 0.15, 0.15, 0);
    this._osc(180, "sawtooth", 0.15, 0.2, 0.15);
  }

  playTick() {
    this._init();
    this._osc(900, "square", 0.04, 0.04, 0);
  }

  playGameOver() {
    this._init();
    [0, 0.2, 0.4, 0.7].forEach((delay, i) => {
      const freqs = [440, 392, 349.23, 293.66];
      this._osc(freqs[i], "triangle", 0.15, 0.3, delay);
    });
  }

  setVolume(v) {
    this.vol = v;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(v, (this.ctx?.currentTime || 0) + 0.1);
    }
  }
}

const audio = new HexaAudio();
audio.bgNodes = { active: true, timers: [] };

export function AudioProvider({ children }) {
  const [volume, setVolumeState] = useState(0.4);
  const [muted, setMuted] = useState(false);

  function setVolume(v) {
    setVolumeState(v);
    audio.setVolume(muted ? 0 : v);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    audio.setVolume(next ? 0 : volume);
  }

  return (
    <AudioContext.Provider value={{ audio, volume, setVolume, muted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
