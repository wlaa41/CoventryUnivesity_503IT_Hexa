import { useState, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider }  from "./contexts/AuthContext";
import { AudioProvider } from "./contexts/AudioContext";
import SplashScreen   from "./components/SplashScreen";
import AuthScreen     from "./components/AuthScreen";
import Dashboard      from "./components/Dashboard";
import HomeScreen     from "./components/HomeScreen";
import GameScreen     from "./components/GameScreen";
import ResultScreen   from "./components/ResultScreen";
import "./style.css";

/* ── CSV parser ─────────────────────────────────────────────────────────── */
function parseCSV(text) {
  const rows = [];
  let cur = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && inQ && n === '"') { cell += '"'; i++; }
    else if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { cur.push(cell); cell = ""; }
    else if ((c === '\n' || c === '\r') && !inQ) {
      if (cell || cur.length) { cur.push(cell); rows.push(cur); cur = []; cell = ""; }
      if (c === '\r' && n === '\n') i++;
    } else cell += c;
  }
  if (cell || cur.length) { cur.push(cell); rows.push(cur); }
  return rows;
}

function csvToQuestions(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().replace("﻿", ""));
  return rows.slice(1)
    .filter(r => r.length > 1)
    .map(r => {
      const q = {};
      headers.forEach((h, i) => { q[h] = (r[i] || "").trim(); });
      let level = (q.level || q.age_group || "").toLowerCase().trim();
      if (level === "children" || level === "child") level = "kids";
      q.level = level;
      q.age_group = level;
      q.correct = "ABCD".indexOf(String(q.correct_option || "A").toUpperCase());
      q.options = [q.option_a, q.option_b, q.option_c, q.option_d];
      q.isActive = q.is_active !== "false";
      return q;
    })
    .filter(q => q.isActive);
}

/* ── App inner (needs AuthContext) ─────────────────────────────────────── */
function Inner() {
  const [screen, setScreen]     = useState("splash");
  const [mode, setMode]         = useState(null);
  const [result, setResult]     = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadErr, setLoadErr]   = useState("");

  useEffect(() => {
    fetch("/content/questions.csv")
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(t => setQuestions(csvToQuestions(t)))
      .catch(() => setLoadErr("⚠️ Could not load questions.csv"));
  }, []);

  if (loadErr) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#ff6b6b",fontSize:18 }}>
      {loadErr}
    </div>
  );

  return (
    <>
      {screen === "splash"    && <SplashScreen onDone={() => setScreen("auth")} />}
      {screen === "auth"      && <AuthScreen onAuth={dest => setScreen(dest)} />}
      {screen === "dashboard" && (
        <Dashboard onPlay={() => setScreen("home")} onLogout={() => setScreen("auth")} />
      )}
      {screen === "home"      && (
        <HomeScreen
          questions={questions}
          onSelect={m => { setMode(m); setScreen("game"); }}
          onDashboard={() => setScreen("dashboard")}
        />
      )}
      {screen === "game"      && (
        <GameScreen
          mode={mode}
          questions={questions}
          onEnd={r => { setResult(r); setScreen("result"); }}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "result"    && (
        <ResultScreen
          result={result}
          onRetry={() => setScreen("game")}
          onHome={() => setScreen("home")}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AudioProvider>
          <div className="app-root">
            <Inner />
          </div>
        </AudioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
