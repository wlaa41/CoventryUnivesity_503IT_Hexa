import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import InstructionsModal from "./InstructionsModal";

import kidsBg from "../assets/images/kids-bg.png";
import teensBg from "../assets/images/teens-bg.png";
import adultsBg from "../assets/images/adults-bg.png";

const MODES = [
  {
    id: "kids",
    title: "Kids Mode",
    subtitle: "CyberWorld Adventure",
    ageRange: "Ages 6 – 12",
    icon: "🧒",
    bg: kidsBg,
    cls: "kids",
    desc: "Safe internet basics, privacy & passwords",
  },
  {
    id: "teens",
    title: "Teens Mode",
    subtitle: "CyberCity Underground",
    ageRange: "Ages 13 – 17",
    icon: "🧑‍💻",
    bg: teensBg,
    cls: "teens",
    desc: "Social media, phishing & online safety",
  },
  {
    id: "adults",
    title: "Adults Mode",
    subtitle: "CyberOffice Intel",
    ageRange: "Ages 18+",
    icon: "🛡️",
    bg: adultsBg,
    cls: "adults",
    desc: "Workplace security, scams & data protection",
  },
];

export default function HomeScreen({ onSelect, onDashboard, questions }) {
  const { theme, toggle } = useTheme();
  const { volume, setVolume, muted, toggleMute } = useAudio();
  const { user, logout } = useAuth();
  const [showInstructions, setShowInstructions] = useState(false);

  function countFor(modeId) {
    const aliases = { kids: ["kids", "children", "child"], teens: ["teens", "teen"], adults: ["adults", "adult"] };
    const keys = aliases[modeId] || [modeId];
    return questions.filter(q => {
      const v = (q.age_group || q.level || "").toLowerCase().trim();
      return keys.includes(v);
    }).length;
  }

  return (
    <div className="home-screen screen">
      <div className="hex-grid" />

      {/* Header */}
      <div className="home-header">
        <div className="home-header-logo">⬡ HEXA</div>
        <div className="home-header-controls">
          {user && !user.isGuest && (
            <button className="icon-btn" onClick={onDashboard} title="Dashboard">📊</button>
          )}
          <button className="icon-btn" onClick={() => setShowInstructions(true)} title="Instructions">❓</button>

          {/* Volume */}
          <div className="volume-control">
            <button
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--text-primary)" }}
              onClick={toggleMute}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <input
              type="range" min="0" max="1" step="0.05"
              value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>

          <button className="icon-btn" onClick={toggle} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user && (
            <button className="icon-btn" onClick={logout} title="Logout" style={{ fontSize: 14 }}>🚪</button>
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="home-title">Choose Your Mode</h1>
      <p className="home-subtitle">Select your age group to begin the cyber adventure</p>

      {/* Mode cards */}
      <div className="mode-cards">
        {MODES.map(m => (
          <div
            key={m.id}
            className={`mode-card ${m.cls}`}
            onClick={() => onSelect(m.id)}
            style={{ backgroundImage: `url(${m.bg})` }}
          >
            {/* Animated hex background blobs */}
            <div className={`mode-card-bg ${m.cls}`} />
            {[70, 100, 50].map((size, i) => (
              <div key={i} className="mode-card-floating-hex" style={{
                width: size, height: size,
                left: `${20 + i * 30}%`,
                animationDuration: `${5 + i * 2}s`,
                animationDelay: `${i * 1.5}s`,
              }} />
            ))}
            <div className="mode-card-content">
              <div className="mode-icon">{m.icon}</div>
              <div className="mode-title">{m.title}</div>
              <div className="mode-subtitle">{m.subtitle}</div>
              <div className="mode-badge">🎯 {m.ageRange}</div>
              <div className="mode-q-count">{countFor(m.id)} questions available</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 24 }}>
        503IT • HEXA Group • Coventry University
      </p>

      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
    </div>
  );
}
