import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 1) return 3;
  if (pct >= 0.67) return 2;
  if (pct >= 0.33) return 1;
  return 0;
}

function Stars({ n }) {
  return (
    <span>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ color: i <= n ? "#ffd700" : "rgba(255,255,255,0.2)", fontSize: 14 }}>★</span>
      ))}
    </span>
  );
}

export default function Dashboard({ onPlay, onLogout }) {
  const { user, logout, getHistory } = useAuth();
  const { theme, toggle } = useTheme();
  const history = getHistory();

  const totalGames = history.length;
  const bestScore = history.reduce((best, g) => Math.max(best, g.score || 0), 0);
  const totalScore = history.reduce((sum, g) => sum + (g.score || 0), 0);
  const avgScore = totalGames ? Math.round(totalScore / totalGames) : 0;

  const modeEmoji = { kids: "🧒", teens: "🧑", adults: "👨‍💼" };
  const modeName = { kids: "Kids", teens: "Teens", adults: "Adults" };

  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div className="dashboard-screen screen">
      <div className="hex-grid" />
      <div className="dashboard-content">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div className="dashboard-greeting">
              Welcome back, <span>{user?.username}</span> 👋
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
              Ready to level up your cyber skills?
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="icon-btn" onClick={toggle} title="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button className="icon-btn" onClick={handleLogout} title="Logout" style={{ fontSize: 14 }}>
              🚪
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{totalGames}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{bestScore}</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{avgScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">
              {history.reduce((t, g) => t + calcStars(g.score, g.total || 15), 0)}
            </div>
            <div className="stat-label">Total Stars</div>
          </div>
        </div>

        {/* Play Now */}
        <button className="btn-primary w-full" style={{ fontSize: 20, padding: "18px", marginBottom: 24 }} onClick={onPlay}>
          ⚡ Play Now
        </button>

        {/* History */}
        <div className="recent-games">
          <div className="section-title">📋 Recent Games</div>
          {history.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "24px 0" }}>
              No games yet — play your first round!
            </div>
          ) : (
            history.slice(0, 8).map((g, i) => (
              <div key={i} className="game-history-item">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{modeEmoji[g.mode] || "🎮"}</span>
                  <div>
                    <div className="game-history-mode">{modeName[g.mode] || g.mode} Mode</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{g.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Stars n={calcStars(g.score, g.total || 15)} />
                  <div className="game-history-score">{g.score}/{g.total || 15}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
