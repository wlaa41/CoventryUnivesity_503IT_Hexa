import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ASCII = `
 ██╗  ██╗███████╗██╗  ██╗ █████╗
 ██║  ██║██╔════╝╚██╗██╔╝██╔══██╗
 ███████║█████╗   ╚███╔╝ ███████║
 ██╔══██║██╔══╝   ██╔██╗ ██╔══██║
 ██║  ██║███████╗██╔╝ ██╗██║  ██║
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`;

export default function AuthScreen({ onAuth }) {
  const { login, signup, playAsGuest } = useAuth();
  const [view, setView] = useState("menu"); // menu | login | signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const WELCOME = "HEXA CYBER QUIZ — v2.0 // Coventry University 503IT";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setTyped(WELCOME.slice(0, i + 1));
      i++;
      if (i >= WELCOME.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(id);
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    const err = login(username, password);
    if (err) { setError(err); return; }
    onAuth("dashboard");
  }

  function handleSignup(e) {
    e.preventDefault();
    const err = signup(username, password);
    if (err) { setError(err); return; }
    onAuth("dashboard");
  }

  function handleGuest() {
    playAsGuest();
    onAuth("home");
  }

  function back() { setView("menu"); setError(""); setUsername(""); setPassword(""); }

  return (
    <div className="auth-screen screen scanlines">
      <div className="terminal">
        {/* Window chrome */}
        <div className="terminal-header">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
          <span className="terminal-title">hexa-quiz — bash — 80×24</span>
        </div>

        {/* ASCII art */}
        <pre className="terminal-ascii">{ASCII}</pre>

        {/* Typing line */}
        <div className="terminal-line">
          <span className="prompt">root@hexa:~$ </span>
          <span className="cmd">{typed}</span>
          {showCursor && <span className="cursor" />}
        </div>

        <div className="terminal-line" style={{ marginBottom: 24, color: "rgba(0,255,0,0.4)" }}>
          System ready. Choose an option below.
        </div>

        {view === "menu" && (
          <div className="terminal-options">
            <button className="terminal-btn" onClick={() => { setView("login"); setError(""); }}>
              <span className="key">[1]</span> LOGIN — access your account
            </button>
            <button className="terminal-btn" onClick={() => { setView("signup"); setError(""); }}>
              <span className="key">[2]</span> SIGN UP — create new account
            </button>
            <button className="terminal-btn" onClick={handleGuest}>
              <span className="key">[3]</span> PLAY AS GUEST — no account needed
            </button>
          </div>
        )}

        {view === "login" && (
          <form className="terminal-form" onSubmit={handleLogin}>
            <div className="terminal-line">
              <span className="prompt">root@hexa:~$ </span>login
            </div>
            <div className="terminal-input-group">
              <span>username:</span>
              <input className="terminal-input" value={username} onChange={e => setUsername(e.target.value)} autoFocus placeholder="your_username" />
            </div>
            <div className="terminal-input-group">
              <span>password:</span>
              <input className="terminal-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <div className="terminal-error">ERROR: {error}</div>}
            <button className="terminal-submit" type="submit">▶ EXECUTE LOGIN</button>
            <button type="button" className="terminal-back" onClick={back}>← back</button>
          </form>
        )}

        {view === "signup" && (
          <form className="terminal-form" onSubmit={handleSignup}>
            <div className="terminal-line">
              <span className="prompt">root@hexa:~$ </span>signup
            </div>
            <div className="terminal-input-group">
              <span>username:</span>
              <input className="terminal-input" value={username} onChange={e => setUsername(e.target.value)} autoFocus placeholder="choose_username" />
            </div>
            <div className="terminal-input-group">
              <span>password:</span>
              <input className="terminal-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="min 4 chars" />
            </div>
            {error && <div className="terminal-error">ERROR: {error}</div>}
            <button className="terminal-submit" type="submit">▶ CREATE ACCOUNT</button>
            <button type="button" className="terminal-back" onClick={back}>← back</button>
          </form>
        )}
      </div>
    </div>
  );
}
