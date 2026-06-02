export default function InstructionsModal({ onClose }) {
  const steps = [
    { icon: "🎯", title: "Choose Your Mode", text: "Pick <strong>Kids</strong>, <strong>Teens</strong>, or <strong>Adults</strong> mode — each tailored to your age group." },
    { icon: "⏱️", title: "30-Second Timer", text: "Each question gives you <strong>30 seconds</strong>. The clock counts down — stay sharp!" },
    { icon: "✅", title: "Answer Correctly", text: "Pick the right answer to <strong>advance</strong> to the next question and keep your score climbing." },
    { icon: "❌", title: "Wrong Answer", text: "Wrong? No worries — the question <strong>resets</strong> and you get to try again. Learn from the explanation!" },
    { icon: "📚", title: "15 Questions", text: "Each mode has <strong>15 questions</strong>: 5 Easy → 5 Medium → 5 Hard. Difficulty ramps up!" },
    { icon: "⭐", title: "Stars & Results", text: "Score <strong>15/15</strong> for 3 full stars. See your results, review all answers, and replay to improve." },
    { icon: "🔊", title: "Music & Sound", text: "Ambient music plays per mode. Adjust <strong>volume</strong> or mute from the top bar anytime." },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">📖 How to Play</h2>
        {steps.map((s, i) => (
          <div key={i} className="instruction-item">
            <div className="instruction-num">{s.icon}</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
              <div className="instruction-text" dangerouslySetInnerHTML={{ __html: s.text }} />
            </div>
          </div>
        ))}
        <button className="btn-primary w-full" style={{ marginTop: 8 }} onClick={onClose}>
          Got it — Let's Play! 🚀
        </button>
      </div>
    </div>
  );
}
