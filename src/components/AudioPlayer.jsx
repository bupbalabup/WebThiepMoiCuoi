import React, { useEffect, useRef, useState } from "react";

// Synthesizes a soothing, romantic acoustic piano melody using Web Audio API
class RomanticMelodyPlayer {
  constructor() {
    this.ctx = null;
    this.timer = null;
    this.step = 0;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playNote(frequency, time, duration = 1.6, velocity = 0.16) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, time);

    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(frequency, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, time);
    filter.frequency.exponentialRampToValueAtTime(260, time + duration);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(velocity, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  start() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    // Canon in D warm progression
    const progression = [
      [174.61, 261.63, 349.23, 440.0, 523.25],
      [130.81, 261.63, 329.63, 392.0, 523.25],
      [146.83, 220.0, 293.66, 349.23, 440.0],
      [110.0, 220.0, 261.63, 329.63, 440.0],
      [116.54, 233.08, 293.66, 349.23, 466.16],
      [174.61, 261.63, 349.23, 440.0, 523.25],
      [98.0, 196.0, 293.66, 349.23, 392.0],
      [130.81, 261.63, 329.63, 392.0, 523.25],
    ];

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor(this.step / 4) % progression.length;
      const chord = progression[chordIndex];
      const noteIndex = this.step % chord.length;

      if (this.step % 4 === 0) {
        this.playNote(chord[0], now, 2.2, 0.14);
      }
      const melodyFreq = chord[noteIndex] || chord[1];
      this.playNote(melodyFreq, now, 1.8, 0.1);

      this.step = (this.step + 1) % (progression.length * 4);
      this.timer = setTimeout(tick, 600);
    };

    tick();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export default function AudioPlayer({ autoPlayTrigger = false }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    playerRef.current = new RomanticMelodyPlayer();
    return () => {
      if (playerRef.current) playerRef.current.stop();
    };
  }, []);

  useEffect(() => {
    if (autoPlayTrigger && playerRef.current && !playing) {
      playerRef.current.start();
      setPlaying(true);
    }
  }, [autoPlayTrigger]);

  function toggle() {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.stop();
      setPlaying(false);
    } else {
      playerRef.current.start();
      setPlaying(true);
    }
  }

  return (
    <div className="audio-player-wrapper" aria-label="Âm nhạc thiệp cưới">
      <button
        type="button"
        className={`audio-toggle-btn ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        title={playing ? "Tắt âm nhạc" : "Bật âm nhạc"}
        aria-pressed={playing}
      >
        <span className="audio-soundwave" aria-hidden="true">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </span>
        <span className="audio-text-label">
          {playing ? "ÂM NHẠC: BẬT" : "ÂM NHẠC: TẮT"}
        </span>
      </button>
    </div>
  );
}
