import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 5000;
    const raf = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(raf);
      else setTimeout(onDone, 300);
    };
    requestAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="splash-screen screen">
      <div className="hex-grid" />
      <div className="blink-overlay" />

      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            background: i % 3 === 0 ? "#00d4ff" : i % 3 === 1 ? "#7c3aed" : "#10b981",
            animationDuration: `${4 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <div className="splash-logo">
        {/* 3-D hexagon */}
        <div className="hex-3d-wrapper">
          <div className="hex-3d">
            <div className="hex-face hex-face-front" />
            <div className="hex-face hex-face-back" />
            <div className="hex-letter">H</div>
          </div>
          <div className="hex-rings">
            <div className="hex-ring ring1" />
            <div className="hex-ring ring2" />
            <div className="hex-ring ring3" />
          </div>
        </div>

        <h1 className="splash-title">HEXA</h1>
        <p className="splash-subtitle">Cyber Security Quiz</p>

        <div className="splash-progress">
          <div className="splash-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="splash-loading">
          {progress < 0.4 ? "Initialising systems…" : progress < 0.8 ? "Loading questions…" : "Almost ready…"}
        </p>
      </div>
    </div>
  );
}
