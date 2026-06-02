import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function calcStars(score, total) {
  const pct = score / total;
  if (pct >= 1)     return 3;
  if (pct >= 0.8)   return 2.5;
  if (pct >= 0.6)   return 2;
  if (pct >= 0.4)   return 1.5;
  if (pct >= 0.2)   return 1;
  if (pct > 0)      return 0.5;
  return 0;
}

function StarDisplay({ stars }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRevealed(r => Math.min(r + 0.5, 3)), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stars-row">
      {[1, 2, 3].map(i => {
        const full  = revealed >= i;
        const half  = !full && revealed >= i - 0.5 && stars >= i - 0.5;
        const empty = stars < i - 0.5;
        return (
          <span
            key={i}
            className={`star ${full && stars >= i ? "filled" : half && !empty ? "half" : ""}`}
            style={{ animationDelay: `${(i - 1) * 0.3}s` }}
          >
            {full && stars >= i ? "⭐" : half && !empty ? "🌟" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

function ReviewPopup({ questions, onClose }) {
  return (
    <div className="review-popup">
      <div className="review-content">
        <h2 className="review-title">📋 Game Review</h2>
        {questions.map((q, i) => {
          const opts = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean).length
            ? [q.option_a, q.option_b, q.option_c, q.option_d]
            : q.options || [];
          const correct = q.correct ?? q.correct_option;
          const correctIdx = typeof correct === "number" ? correct : "ABCD".indexOf(String(correct).toUpperCase());
          const correctText = opts[correctIdx] || "—";

          return (
            <div key={i} className={`review-item ${q._wasCorrect ? "correct" : "wrong"}`}>
              <div className="review-q">
                {q._wasCorrect ? "✅" : "❌"} Q{i + 1}: {q.question}
              </div>
              <div className="review-answer">
                Correct answer: <span className="correct-text">{correctText}</span>
              </div>
              {q.explanation && (
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
        <button className="btn-primary w-full" style={{ marginTop: 8 }} onClick={onClose}>
          Close Review
        </button>
      </div>
    </div>
  );
}

const MESSAGES = {
  3:    ["🌟 Perfect Score! You're a Cyber Security expert!", "Outstanding! Full marks — the internet is safe with you! 🛡️"],
  2.5:  ["🔥 Almost perfect! Just a couple more to go!", "Brilliant work — you're nearly unstoppable!"],
  2:    ["💪 Great effort! Strong cyber awareness!", "Well done — keep sharpening those skills!"],
  1.5:  ["📈 Good start! You're getting there!", "Not bad — review the explanations and try again!"],
  1:    ["🎓 Keep learning! Cybersecurity knowledge grows with practice.", "Every expert started here — keep going!"],
  0.5:  ["🌱 Early days! Review the lessons and come back stronger.", "Don't give up — cybersecurity is a journey!"],
  0:    ["💡 Keep trying! Everyone starts somewhere.", "Next time will be better — you've got this!"],
};

function getMessage(stars) {
  const msgs = MESSAGES[stars] || MESSAGES[0];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

const MODE_LABEL = { kids: "Kids 🧒", teens: "Teens 🧑‍💻", adults: "Adults 🛡️" };

export default function ResultScreen({ result, onRetry, onHome }) {
  const { saveGameResult } = useAuth();
  const [showReview, setShowReview] = useState(false);

  const { score, total, mode, questions = [] } = result || {};
  const stars = calcStars(score, total);
  const pct   = Math.round((score / total) * 100);
  const message = getMessage(stars);

  useEffect(() => {
    saveGameResult({ score, total, mode, stars });
  }, []);

  const trophy = stars >= 3 ? "🏆" : stars >= 2 ? "🥇" : stars >= 1 ? "🥈" : "🥉";

  return (
    <div className="result-screen screen">
      <div className="hex-grid" />

      {/* Particles */}
      <div className="particles" style={{ opacity: 0.5 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            background: ["#ffd700","#00d4ff","#7c3aed","#10b981"][i % 4],
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      <div className="result-content">
        <div className="result-trophy">{trophy}</div>
        <h1 className="result-title">Quiz Complete!</h1>
        <div className="result-score">
          You scored <strong>{score}</strong> / {total} &nbsp;•&nbsp; {pct}%
          &nbsp;•&nbsp; {MODE_LABEL[mode] || mode} Mode
        </div>

        <StarDisplay stars={stars} />

        <p className="result-message">{message}</p>

        <div className="result-actions">
          <button className="btn-primary" onClick={onRetry}>▶ Play Again</button>
          <button className="btn-secondary" onClick={() => setShowReview(true)}>📋 Review Answers</button>
          <button className="btn-secondary" onClick={onHome}>🏠 Change Mode</button>
        </div>
      </div>

      {showReview && <ReviewPopup questions={questions} onClose={() => setShowReview(false)} />}
    </div>
  );
}
