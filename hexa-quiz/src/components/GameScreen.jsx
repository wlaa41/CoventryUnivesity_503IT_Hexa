import { useState, useEffect, useRef, useCallback } from "react";
import { useAudio } from "../contexts/AudioContext";

const TIMER_MAX = 30;
const CIRCUMFERENCE = 2 * Math.PI * 30; // r=30

const MODE_CONFIG = {
  kids:   { mascot: "🧒", color: "#10b981", label: "Kids Mode",   bgClass: "kids"   },
  teens:  { mascot: "🧑‍💻", color: "#00d4ff", label: "Teens Mode",  bgClass: "teens"  },
  adults: { mascot: "🛡️",  color: "#7c3aed", label: "Adults Mode", bgClass: "adults" },
};

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildQuestions(allQuestions, mode) {
  const aliases = { kids: ["kids","children","child"], teens: ["teens","teen"], adults: ["adults","adult"] };
  const keys = aliases[mode] || [mode];
  const pool = allQuestions.filter(q => {
    const v = (q.age_group || q.level || "").toLowerCase().trim();
    return keys.includes(v) && q.isActive !== false && q.is_active !== "false";
  });
  const byDiff = (d) => pool.filter(q => (q.difficulty || "").toLowerCase() === d);
  const easy   = shuffle(byDiff("easy")).slice(0, 5);
  const medium = shuffle(byDiff("medium")).slice(0, 5);
  const hard   = shuffle(byDiff("hard")).slice(0, 5);
  const result = [...easy, ...medium, ...hard];
  // If not enough by difficulty, fill from the rest
  if (result.length < 15) {
    const used = new Set(result.map(q => q.id));
    const extra = shuffle(pool.filter(q => !used.has(q.id)));
    result.push(...extra.slice(0, 15 - result.length));
  }
  return result;
}

function Confetti() {
  const pieces = Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    color: ["#00d4ff","#7c3aed","#10b981","#ffd700","#ff6b6b"][i % 5],
    delay: `${Math.random() * 0.5}s`,
    duration: `${0.8 + Math.random() * 0.8}s`,
    size: `${6 + Math.random() * 8}px`,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 25, overflow: "hidden" }}>
      {pieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={{
          left: p.left, background: p.color,
          width: p.size, height: p.size,
          animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

export default function GameScreen({ mode, questions, onEnd, onBack }) {
  const { audio } = useAudio();
  const cfg = MODE_CONFIG[mode] || MODE_CONFIG.adults;

  const gameQuestions = useRef(buildQuestions(questions, mode));
  const [qIndex, setQIndex]       = useState(0);
  const [score, setScore]         = useState(0);
  const [timeLeft, setTimeLeft]   = useState(TIMER_MAX);
  const [selected, setSelected]   = useState(null); // index chosen
  const [phase, setPhase]         = useState("question"); // question | feedback
  const [showCorrect, setShowCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shaking, setShaking]     = useState(false);
  const timerRef                  = useRef(null);

  const totalQ = gameQuestions.current.length;
  const q      = gameQuestions.current[qIndex];

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(TIMER_MAX);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // Time up = treat as wrong
          handleWrong();
          return 0;
        }
        if (t <= 6) audio.playTick();
        return t - 1;
      });
    }, 1000);
  }, [qIndex]);

  useEffect(() => {
    audio.startBg(mode);
    startTimer();
    return () => { clearInterval(timerRef.current); audio.stopBg(); };
  }, []);

  useEffect(() => {
    if (phase === "question") startTimer();
  }, [qIndex, phase]);

  function handleWrong() {
    clearInterval(timerRef.current);
    audio.playWrong();
    setShaking(true);
    setPhase("feedback");
    setTimeout(() => setShaking(false), 500);
  }

  function answer(optionIndex) {
    if (phase !== "question") return;
    clearInterval(timerRef.current);
    setSelected(optionIndex);

    const correct = q.correct ?? q.correct_option;
    const isRight = typeof correct === "number"
      ? optionIndex === correct
      : String.fromCharCode(65 + optionIndex) === String(correct).toUpperCase();

    if (isRight) {
      audio.playCorrect();
      setScore(s => s + 1);
      setShowCorrect(true);
      setShowConfetti(true);
      setTimeout(() => setShowCorrect(false), 600);
      setTimeout(() => setShowConfetti(false), 1000);
      setTimeout(() => {
        setSelected(null);
        if (qIndex + 1 >= totalQ) {
          endGame(score + 1);
        } else {
          setQIndex(i => i + 1);
          setPhase("question");
        }
      }, 1200);
    } else {
      handleWrong();
    }
  }

  function retryQuestion() {
    setSelected(null);
    setPhase("question");
  }

  function endGame(finalScore) {
    audio.stopBg();
    audio.playGameOver();
    onEnd({
      score: finalScore,
      total: totalQ,
      mode,
      questions: gameQuestions.current,
    });
  }

  // Timer circle
  const progress = timeLeft / TIMER_MAX;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const timerColor = timeLeft > 10 ? "#10b981" : timeLeft > 5 ? "#f59e0b" : "#ef4444";

  const getOptionClass = (i) => {
    if (selected === null) return "option-btn";
    const correct = q.correct ?? q.correct_option;
    const isRight = typeof correct === "number" ? i === correct : String.fromCharCode(65 + i) === String(correct).toUpperCase();
    if (i === selected && isRight) return "option-btn correct";
    if (i === selected && !isRight) return "option-btn wrong";
    if (isRight) return "option-btn reveal";
    return "option-btn";
  };

  const options = [q?.option_a, q?.option_b, q?.option_c, q?.option_d]
    .filter(Boolean)
    .length > 0
    ? [q?.option_a, q?.option_b, q?.option_c, q?.option_d]
    : q?.options || [];

  const diffLevel = (q?.difficulty || "easy").toLowerCase();

  return (
    <div className={`game-screen screen ${shaking ? "screen-shake" : ""}`}>
      {/* Background */}
      <div className={`game-bg ${cfg.bgClass}`} />
      <div className="hex-grid" style={{ opacity: 0.06 }} />

      {/* Moving background elements */}
      <div className="game-lane" />
      <div className="running-char">{cfg.mascot}</div>

      {/* Particles */}
      <div className="particles" style={{ opacity: 0.4 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${10 + i * 12}%`,
            width: 4, height: 4,
            background: cfg.color,
            animationDuration: `${5 + i}s`,
            animationDelay: `${i * 0.8}s`,
          }} />
        ))}
      </div>

      {showCorrect && <div className="correct-flash" />}
      {showConfetti && <Confetti />}

      {/* UI Layer */}
      <div className="game-ui">
        {/* Top bar */}
        <div className="game-topbar">
          <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { clearInterval(timerRef.current); audio.stopBg(); onBack(); }}>
            ← Home
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>
              Question {qIndex + 1} of {totalQ}
            </div>
            <div style={{ height: 4, width: 160, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((qIndex) / totalQ) * 100}%`, background: cfg.color, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Timer ring */}
          <div className="timer-ring">
            <svg viewBox="0 0 70 70">
              <circle className="timer-circle-bg" cx="35" cy="35" r="30" />
              <circle
                className="timer-circle-fill"
                cx="35" cy="35" r="30"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                stroke={timerColor}
                style={{ transform: "rotate(-90deg)", transformOrigin: "35px 35px" }}
              />
            </svg>
            <div className="timer-value" style={{ color: timerColor }}>{timeLeft}</div>
          </div>

          <div className="game-score">
            Score: <span style={{ color: cfg.color }}>{score}</span>
          </div>
        </div>

        {/* Question card */}
        <div className="question-card">
          <div className="question-meta">
            <span className={`badge-pill ${diffLevel}`}>{q?.difficulty || "Easy"}</span>
            <span className="badge-pill topic">{(q?.topic || "cyber").replace(/_/g, " ")}</span>
            <span className="badge-pill" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {cfg.label}
            </span>
          </div>

          {q?.story && (
            <div className="story-box">
              <div className="story-label">📖 Scenario</div>
              {q.story}
            </div>
          )}

          <div className="question-text">{q?.question}</div>

          <div className="options-grid">
            {options.map((opt, i) => (
              <button
                key={i}
                className={getOptionClass(i)}
                disabled={selected !== null}
                onClick={() => answer(i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wrong feedback overlay */}
      {phase === "feedback" && selected !== null && (
        <div className="feedback-overlay">
          <div className="wrong-flash" style={{ position: "absolute", inset: 0 }} />
          <div className="feedback-card wrong">
            <div className="feedback-icon">❌</div>
            <div className="feedback-title wrong">Not Quite!</div>
            {q?.explanation && (
              <div className="feedback-explanation">{q.explanation}</div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-primary" onClick={retryQuestion}>🔄 Try Again</button>
              <button className="btn-secondary" onClick={() => { clearInterval(timerRef.current); audio.stopBg(); onBack(); }}>
                🏠 Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
