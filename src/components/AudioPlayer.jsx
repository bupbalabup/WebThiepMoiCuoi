import React, { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ autoPlayTrigger = false }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Sync state with audio events and configure initial volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.7;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onError = (e) => {
      console.warn("Audio playback notice:", e);
      setPlaying(false);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, []);

  // Handle external autoplay trigger (e.g. envelope opened / unsealed)
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPlaying(true))
          .catch((err) => {
            console.log("Autoplay waiting for direct interaction:", err?.message || err);
          });
      }
    }
  }, [autoPlayTrigger]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPlaying(true))
          .catch((err) => {
            console.warn("Audio play prevented:", err);
          });
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="audio-player-wrapper" aria-label="Âm nhạc thiệp cưới">
      <audio
        ref={audioRef}
        src="/music/doiloi.mp3"
        preload="auto"
        loop
        playsInline
      />
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
