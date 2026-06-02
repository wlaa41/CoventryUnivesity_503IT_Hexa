import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import homeHubBg from "./assets/images/home-hub-bg.png";
import kidsBg from "./assets/images/kids-bg.png";
import teensBg from "./assets/images/teens-bg.png";
import adultsBg from "./assets/images/adults-bg.png";
import hexaGroupLogo from "./assets/images/hexa-group-logo.png";

const levelInfo = {
  kids: {
    title: "Kids Academy",
    subtitle: "Castle Defense",
    description: "Bright, friendly missions for first cyber-safety skills.",
    glyph: "K",
    source: "Childnet + NSPCC",
    runner: "Sky Castle Sprint",
    bg: kidsBg
  },
  teens: {
    title: "Teen Cybercity",
    subtitle: "Threat Tracker",
    description: "Fast-moving choices through a neon digital city.",
    glyph: "T",
    source: "NCSC + Childnet",
    runner: "Neon Rooftop Rush",
    bg: teensBg
  },
  adults: {
    title: "Adult Intel",
    subtitle: "Office Defense",
    description: "Professional pressure tests for real-world decisions.",
    glyph: "A",
    source: "NCSC + OWASP",
    runner: "Executive Data Run",
    bg: adultsBg
  }
};

const stageNames = ["Easy", "Medium", "Hard"];
const difficultyRank = { easy: 0, medium: 1, hard: 2 };
const defaultStats = {
  bestScores: { kids: 0, teens: 0, adults: 0 },
  missionsCompleted: 0,
  runnerPoints: 0,
  reviews: []
};

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < csvText.length; index++) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      index++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentValue || currentRow.length > 0) {
        currentRow.push(currentValue);
        rows.push(currentRow);
        currentRow = [];
        currentValue = "";
      }

      if (char === "\r" && nextChar === "\n") index++;
    } else {
      currentValue += char;
    }
  }

  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}

function convertCorrectOption(correctOption) {
  const answer = String(correctOption).trim().toUpperCase();
  const optionMap = { A: 0, B: 1, C: 2, D: 3 };

  return Object.hasOwn(optionMap, answer) ? optionMap[answer] : -1;
}

function convertCSVToQuestions(csvText) {
  const rows = parseCSV(csvText);

  if (rows.length < 2) return [];

  const headers = rows[0].map((header) =>
    header.trim().replace("\ufeff", "")
  );

  return rows
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) => {
      const item = {};

      headers.forEach((header, index) => {
        item[header] = row[index] ? row[index].trim() : "";
      });

      let level = (item.level || item.age_group || "").toLowerCase().trim();

      if (level === "children" || level === "child") level = "kids";

      return {
        id: Number(item.id),
        level,
        topic: item.topic || "general",
        originalDifficulty: (item.difficulty || "easy").toLowerCase(),
        story: item.story || "",
        question: item.question || "",
        options: [
          item.option_a || "",
          item.option_b || "",
          item.option_c || "",
          item.option_d || ""
        ],
        correct: convertCorrectOption(item.correct_option),
        explanation: item.explanation || "",
        isActive: item.is_active !== "false"
      };
    })
    .filter(
      (question) =>
        question.isActive &&
        question.correct >= 0 &&
        question.question &&
        question.options.every(Boolean)
    );
}

function formatTopic(topic) {
  return topic
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStatsKey(profile) {
  return `hexa_stats_${profile?.email || "guest"}`;
}

async function hashPassword(password) {
  if (!window.crypto?.subtle) return btoa(password);

  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

function useAdaptiveAudio(scene, topic, enabled, volume) {
  const engineRef = useRef(null);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);
  const startedRef = useRef(false);
  const [audioRevision, setAudioRevision] = useState(0);

  const stopMusic = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const createTone = useCallback((frequency, duration, gainValue, type = "sine") => {
    const engine = engineRef.current;

    if (!engine || engine.context.state !== "running") return;

    const oscillator = engine.context.createOscillator();
    const gain = engine.context.createGain();
    const now = engine.context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(engine.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.04);
  }, []);

  const playSfx = useCallback(
    (kind) => {
      if (!engineRef.current || !enabled) return;

      if (kind === "correct") {
        createTone(523.25, 0.18, 0.13, "triangle");
        setTimeout(() => createTone(783.99, 0.28, 0.11, "triangle"), 120);
      } else if (kind === "wrong") {
        createTone(196, 0.22, 0.11, "sawtooth");
        setTimeout(() => createTone(146.83, 0.3, 0.09, "sawtooth"), 120);
      } else if (kind === "collect") {
        createTone(880, 0.1, 0.07, "square");
      } else if (kind === "impact") {
        createTone(92.5, 0.25, 0.12, "sawtooth");
      }
    },
    [createTone, enabled]
  );

  const primeAudio = useCallback(async () => {
    if (!engineRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = volume;
      master.connect(context.destination);
      engineRef.current = { context, master };
    }

    if (engineRef.current.context.state === "suspended") {
      await engineRef.current.context.resume();
    }

    if (!startedRef.current) {
      startedRef.current = true;
      setAudioRevision((current) => current + 1);
    }
  }, [volume]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.master.gain.setTargetAtTime(
      enabled ? volume : 0.0001,
      engine.context.currentTime,
      0.08
    );
  }, [enabled, volume]);

  useEffect(() => {
    stopMusic();

    const engine = engineRef.current;
    if (!engine || !enabled || engine.context.state !== "running") return;

    const topicShift = {
      phishing: 0,
      privacy: 3,
      passwords: 5,
      social_engineering: 7,
      cyberbullying: 9,
      malware: 10,
      general: 2
    }[topic] ?? 2;

    const config = {
      intro: { root: 110, pattern: [0, 7, 12, 7], pace: 420, wave: "sine" },
      portal: { root: 130.81, pattern: [0, 3, 7, 10], pace: 360, wave: "triangle" },
      home: { root: 146.83, pattern: [0, 7, 10, 12, 10, 7], pace: 330, wave: "triangle" },
      dashboard: { root: 164.81, pattern: [0, 4, 7, 11], pace: 420, wave: "sine" },
      quiz: { root: 138.59, pattern: [0, 7, 3, 10, 5, 12], pace: 300, wave: "triangle" },
      runner: { root: 174.61, pattern: [0, 12, 7, 15, 10, 7, 12, 17], pace: 170, wave: "square" },
      result: { root: 196, pattern: [0, 4, 7, 12, 7, 4], pace: 380, wave: "triangle" }
    }[scene] || { root: 130.81, pattern: [0, 7, 12, 7], pace: 400, wave: "sine" };

    stepRef.current = 0;

    function pulse() {
      const step = stepRef.current++;
      const semitone = config.pattern[step % config.pattern.length];
      const adjustedShift = scene === "quiz" ? topicShift : 0;
      const frequency = config.root * 2 ** ((semitone + adjustedShift) / 12);

      createTone(frequency, scene === "runner" ? 0.17 : 0.46, 0.032, config.wave);

      if (step % 4 === 0) {
        createTone(config.root / 2, scene === "runner" ? 0.13 : 0.32, 0.04, "sine");
      }
    }

    pulse();
    intervalRef.current = setInterval(pulse, config.pace);

    return stopMusic;
  }, [audioRevision, createTone, enabled, scene, stopMusic, topic]);

  useEffect(
    () => () => {
      stopMusic();
      engineRef.current?.context.close();
    },
    [stopMusic]
  );

  return { primeAudio, playSfx };
}

function HexMark({ glyph = "H", small = false, large = false }) {
  return (
    <span
      className={`hex-mark ${small ? "small" : ""} ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      <span>{glyph}</span>
    </span>
  );
}

function LogoCore({ intro = false }) {
  return (
    <div className={`logo-core ${intro ? "intro-logo" : ""}`} aria-label="Hexa logo">
      <span className="logo-orbit orbit-a"></span>
      <span className="logo-orbit orbit-b"></span>
      <span className="logo-orbit orbit-c"></span>
      <HexMark glyph="H" large />
      <span className="logo-flare"></span>
    </div>
  );
}

function SceneEffects({ intense = false }) {
  return (
    <div className={`scene-effects ${intense ? "intense" : ""}`} aria-hidden="true">
      <span className="grid-floor"></span>
      <span className="scene-orbit scene-orbit-one"></span>
      <span className="scene-orbit scene-orbit-two"></span>
      <span className="hex-spark spark-one"></span>
      <span className="hex-spark spark-two"></span>
      <span className="hex-spark spark-three"></span>
      <span className="scan-beam"></span>
      <span className="light-column column-one"></span>
      <span className="light-column column-two"></span>
    </div>
  );
}

function AudioDock({
  musicOn,
  setMusicOn,
  volume,
  setVolume,
  voiceOn,
  setVoiceOn,
  theme,
  setTheme,
  onInstructions,
  compact = false
}) {
  return (
    <div className={`audio-dock ${compact ? "compact" : ""}`}>
      <button
        className="icon-btn"
        onClick={() => setMusicOn((current) => !current)}
        aria-label={musicOn ? "Mute music" : "Play music"}
        title={musicOn ? "Mute adaptive music" : "Play adaptive music"}
      >
        {musicOn ? "MUSIC ON" : "MUSIC OFF"}
      </button>

      <label className="volume-control">
        <span>VOL</span>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Music volume"
        />
      </label>

      <button
        className="icon-btn"
        onClick={() => setVoiceOn((current) => !current)}
        aria-label={voiceOn ? "Turn voice guide off" : "Turn voice guide on"}
      >
        {voiceOn ? "VOICE ON" : "VOICE OFF"}
      </button>

      <button
        className="icon-btn theme-btn"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "LIGHT" : "DARK"}
      </button>

      <button className="icon-btn" onClick={onInstructions}>
        INSTRUCTIONS
      </button>
    </div>
  );
}

function InstructionsModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel panel-3d" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close instructions">
          X
        </button>
        <p className="eyebrow">FIELD MANUAL</p>
        <h2>How to play Hexa</h2>

        <div className="instruction-grid">
          <article>
            <strong>01</strong>
            <h3>Choose a track</h3>
            <p>Each mode contains 15 missions: five Easy, five Medium, and five Hard.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Solve the scenario</h3>
            <p>Listen to the question and choose the safest response. A wrong answer must be resolved.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Earn a bike ride</h3>
            <p>Every correct response unlocks a 20-second 3D bike ride. Steer, boost, brake, collect energy rings, and avoid obstacles.</p>
          </article>
          <article>
            <strong>04</strong>
            <h3>Collect your stars</h3>
            <p>Finish with a first-try score. A perfect 15/15 earns all three stars.</p>
          </article>
        </div>

        <button className="primary-btn" onClick={onClose}>READY</button>
      </section>
    </div>
  );
}

function IntroScreen({ loading, error }) {
  return (
    <main className="app intro-screen" style={{ backgroundImage: `url(${homeHubBg})` }}>
      <div className="screen-overlay"></div>
      <SceneEffects intense />

      <section className="intro-content">
        <div className="intro-brand-frame">
          <img className="intro-brand-image" src={hexaGroupLogo} alt="HEXA group logo" />
        </div>
        <p className="eyebrow">INITIALIZING CYBER RANGE</p>
        <p className="intro-status">
          {error || (loading ? "Loading verified scenarios..." : "Secure link established")}
        </p>
        <div className="intro-loader"><span></span></div>
        <small>Audio unlocks after your first tap.</small>
      </section>
    </main>
  );
}

function PortalScreen({
  authMode,
  setAuthMode,
  form,
  setForm,
  authError,
  onSubmit,
  onGuest,
  savedProfile,
  onResume,
  controls
}) {
  return (
    <main className="app portal-screen" style={{ backgroundImage: `url(${homeHubBg})` }}>
      <div className="screen-overlay"></div>
      <SceneEffects />
      <AudioDock {...controls} compact />

      <section className="portal-layout">
        <div className="portal-copy">
          <LogoCore />
          <p className="eyebrow">SECURE TRAINING TERMINAL</p>
          <h1>Enter the range.</h1>
          <p>
            Sign in to keep your best scores and bike points on this device,
            or launch a guest session immediately.
          </p>
          <div className="terminal-lines">
            <span><i></i> ADAPTIVE AUDIO READY</span>
            <span><i></i> 45 SCENARIOS INDEXED</span>
            <span><i></i> THREE DIFFICULTY PHASES ONLINE</span>
          </div>
        </div>

        <section className="terminal-card panel-3d">
          <div className="terminal-bar">
            <span>HEXA_LOGIN_PORTAL</span>
            <span>LOCAL DEMO ACCESS</span>
          </div>

          <div className="auth-tabs">
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              LOGIN
            </button>
            <button
              className={authMode === "signup" ? "active" : ""}
              onClick={() => setAuthMode("signup")}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={onSubmit}>
            {authMode === "signup" && (
              <label>
                <span>CALLSIGN / NAME</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your display name"
                />
              </label>
            )}
            <label>
              <span>EMAIL</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="player@example.com"
              />
            </label>
            <label>
              <span>PASSCODE</span>
              <input
                required
                type="password"
                minLength="4"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Minimum 4 characters"
              />
            </label>

            {authError && <p className="form-error">{authError}</p>}

            <button className="primary-btn" type="submit">
              {authMode === "signup" ? "CREATE LOCAL PROFILE" : "ACCESS TERMINAL"}
            </button>
          </form>

          {savedProfile && (
            <button className="resume-btn" onClick={onResume}>
              Resume as {savedProfile.name}
            </button>
          )}

          <button className="guest-btn" onClick={onGuest}>
            PLAY AS GUEST
          </button>
          <small>
            Prototype portal: profiles are stored locally in this browser. Use a
            server authentication service before a public release.
          </small>
        </section>
      </section>
    </main>
  );
}

function TopNavigation({ profile, screen, onHome, onDashboard, onLogout, controls }) {
  return (
    <header className="home-nav app-nav">
      <button className="brand brand-button" onClick={onHome}>
        <HexMark small />
        <span>HEXA <b>/</b> CYBER RANGE</span>
      </button>

      <nav>
        <button className={screen === "home" ? "active" : ""} onClick={onHome}>MISSIONS</button>
        <button className={screen === "dashboard" ? "active" : ""} onClick={onDashboard}>DASHBOARD</button>
      </nav>

      <div className="nav-profile">
        <span>{profile?.name || "Guest"}</span>
        <button onClick={onLogout}>LOG OUT</button>
      </div>

      <AudioDock {...controls} compact />
    </header>
  );
}

function HomeScreen({
  questions,
  profile,
  stats,
  onChooseLevel,
  navigation,
  onInstructions
}) {
  return (
    <main className="app home-screen" style={{ backgroundImage: `url(${homeHubBg})` }}>
      <div className="home-overlay"></div>
      <SceneEffects />

      <section className="home-shell">
        <TopNavigation {...navigation} />

        <div className="hero">
          <p className="eyebrow">WELCOME BACK, {(profile?.name || "GUEST").toUpperCase()}</p>
          <h1>
            THINK FAST.
            <span>RUN SMART.</span>
          </h1>
          <p className="hero-copy">
            Solve cyber-safety scenarios, unlock 20-second 3D bike rides, and build
            your first-try score across the range.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={onInstructions}>HOW TO PLAY</button>
            <span><b>{stats.runnerPoints}</b> TOTAL BIKE POINTS</span>
          </div>
        </div>

        <section className="mode-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SELECT ACCESS LEVEL</p>
              <h2>Choose your 3D bike mission</h2>
            </div>
            <p>Each track escalates through five Easy, five Medium, and five Hard scenarios.</p>
          </div>

          <div className="level-grid">
            {Object.entries(levelInfo).map(([key, item], index) => {
              const questionCount = questions.filter((question) => question.level === key).length;

              return (
                <button
                  key={key}
                  className={`level-card ${key}`}
                  onClick={() => onChooseLevel(key)}
                  style={{ backgroundImage: `url(${item.bg})` }}
                >
                  <span className="level-card-overlay"></span>
                  <span className="card-number">0{index + 1}</span>
                  <span className="card-content">
                    <HexMark glyph={item.glyph} />
                    <span className="mode-chip">{item.subtitle}</span>
                    <strong>{item.title}</strong>
                    <span className="mode-description">{item.description}</span>
                    <span className="difficulty-strip">
                      <i>EASY 5</i><i>MEDIUM 5</i><i>HARD 5</i>
                    </span>
                    <span className="card-footer">
                      <span>{questionCount} SCENARIOS</span>
                      <span>BEST {stats.bestScores[key]}/15</span>
                      <span className="launch">LAUNCH +</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

function DashboardScreen({ profile, stats, navigation }) {
  const totalBest = Object.values(stats.bestScores).reduce((sum, score) => sum + score, 0);

  return (
    <main className="app dashboard-screen" style={{ backgroundImage: `url(${homeHubBg})` }}>
      <div className="home-overlay"></div>
      <SceneEffects />

      <section className="home-shell">
        <TopNavigation {...navigation} />

        <section className="dashboard-head">
          <p className="eyebrow">PLAYER DASHBOARD</p>
          <h1>{profile?.name || "Guest"} / Range report</h1>
          <p>Your progress is stored on this device. Push each mode toward a perfect 15.</p>
        </section>

        <div className="dashboard-metrics">
          <article className="panel-3d">
            <span>TOTAL BEST SCORE</span>
            <strong>{totalBest}<small>/45</small></strong>
          </article>
          <article className="panel-3d">
            <span>MISSIONS COMPLETED</span>
            <strong>{stats.missionsCompleted}</strong>
          </article>
          <article className="panel-3d">
            <span>BIKE POINTS</span>
            <strong>{stats.runnerPoints}</strong>
          </article>
          <article className="panel-3d">
            <span>REVIEWS SENT</span>
            <strong>{stats.reviews.length}</strong>
          </article>
        </div>

        <div className="dashboard-tracks">
          {Object.entries(levelInfo).map(([key, item]) => {
            const best = stats.bestScores[key];

            return (
              <article className="track-card panel-3d" key={key}>
                <HexMark glyph={item.glyph} />
                <div>
                  <p className="eyebrow">{item.subtitle}</p>
                  <h2>{item.title}</h2>
                  <span>{best}/15 FIRST-TRY POINTS</span>
                  <div className="dashboard-progress">
                    <i style={{ width: `${(best / 15) * 100}%` }}></i>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function BikeRewardStage({ level, questionIndex, onComplete }) {
  const frameRef = useRef(null);
  const completionRef = useRef(onComplete);
  const difficulty = stageNames[Math.min(2, Math.floor(questionIndex / 5))].toLowerCase();
  const rideLevel = Math.min(10, questionIndex + 1);
  const src = `/bike-game/index.html?embed=1&mode=${difficulty}&seconds=20&level=${rideLevel}`;

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    function receiveBikeSummary(event) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.type !== "hexa-bike-complete"
      ) {
        return;
      }

      completionRef.current({
        points: Number(event.data.points) || 0,
        collected: Number(event.data.collected) || 0,
        crashes: Number(event.data.crashes) || 0
      });
    }

    window.addEventListener("message", receiveBikeSummary);
    return () => window.removeEventListener("message", receiveBikeSummary);
  }, []);

  return (
    <main className={`app bike-reward-screen ${level}`}>
      <iframe
        ref={frameRef}
        className="bike-game-frame"
        src={src}
        title={`${levelInfo[level].title} 3D bike reward stage`}
        allow="autoplay"
      />
    </main>
  );
}

function QuizScreen({
  level,
  question,
  questionIndex,
  total,
  score,
  mistakes,
  selectedAnswer,
  pointEligible,
  onAnswer,
  onRetry,
  onRun,
  onExit,
  onSpeak,
  controls
}) {
  const levelData = levelInfo[level];
  const progress = ((questionIndex + 1) / total) * 100;
  const isCorrect = selectedAnswer === question.correct;

  return (
    <main className={`app game-screen ${level}`} style={{ backgroundImage: `url(${levelData.bg})` }}>
      <div className="screen-overlay"></div>
      <SceneEffects />

      <section className="game-shell">
        <header className="top-bar">
          <button className="ghost-btn" onClick={onExit}>&lt; EXIT RANGE</button>
          <div className="mission-label">
            <span>{levelData.title}</span>
            <strong>{levelData.subtitle}</strong>
          </div>
          <div className="top-actions">
            <button className="ghost-btn" onClick={onSpeak}>VOICE REPLAY</button>
            <span className="hud-chip">SCORE <b>{score}</b></span>
            <span className="hud-chip warning">MISSES <b>{mistakes}</b></span>
          </div>
        </header>

        <AudioDock {...controls} compact />

        <div className="progress-track" aria-label="Question progress">
          <span style={{ width: `${progress}%` }}></span>
        </div>

        <div className="game-layout">
          <aside className="mission-rail panel-3d">
            <p className="eyebrow">LIVE READOUT</p>
            <div className="progress-dial" style={{ "--progress": `${progress * 3.6}deg` }}>
              <div><strong>{questionIndex + 1}</strong><span>OF {total}</span></div>
            </div>
            <dl>
              <div><dt>PHASE</dt><dd>{question.stageDifficulty}</dd></div>
              <div><dt>TOPIC</dt><dd>{formatTopic(question.topic)}</dd></div>
              <div><dt>POINT STATUS</dt><dd>{pointEligible ? "FIRST TRY LIVE" : "RETRY MODE"}</dd></div>
              <div><dt>GUIDANCE</dt><dd>{levelData.source}</dd></div>
            </dl>
          </aside>

          <section className="quiz-card panel-3d">
            <div className="quiz-header">
              <p className="eyebrow">SCENARIO {String(questionIndex + 1).padStart(2, "0")}</p>
              <span className={`phase-chip ${question.stageDifficulty.toLowerCase()}`}>
                {question.stageDifficulty.toUpperCase()} PHASE
              </span>
            </div>

            <div className="scenario-brief">
              <span className="brief-label">SITUATION REPORT</span>
              <p>{question.story}</p>
            </div>

            <h2>{question.question}</h2>
            <p className="answer-instruction">Choose the safest response. Wrong answers must be resolved.</p>

            <div className="answers">
              {question.options.map((option, index) => {
                let className = "answer-btn";

                if (selectedAnswer !== null) {
                  if (index === question.correct) className += " correct";
                  else if (index === selectedAnswer) className += " wrong";
                  else className += " muted";
                }

                return (
                  <button
                    key={option}
                    className={className}
                    disabled={selectedAnswer !== null}
                    onClick={() => onAnswer(index)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-copy">{option}</span>
                    <span className="option-state" aria-hidden="true">
                      {index === question.correct && selectedAnswer !== null ? "OK" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className={`feedback ${isCorrect ? "success" : "review"}`}>
                <div>
                  <p className="eyebrow">{isCorrect ? "ANSWER VERIFIED" : "RETRY REQUIRED"}</p>
                  <h3>{isCorrect ? "Correct. Bike ride unlocked." : "Not quite. Resolve the signal."}</h3>
                  <p>{question.explanation}</p>
                </div>
                <button className="primary-btn" onClick={isCorrect ? onRun : onRetry}>
                  {isCorrect ? "START 20-SECOND BIKE RIDE >" : "TRY QUESTION AGAIN"}
                </button>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function ReviewModal({ level, score, onSave, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const modeTitle = levelInfo[level]?.title || "HEXA";

  return (
    <div className="modal-backdrop">
      <section className="modal-panel review-panel panel-3d" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close review">X</button>
        <p className="eyebrow">MODE COMPLETE | QUICK GAME REVIEW</p>
        <h2>Rate your {modeTitle} run.</h2>
        <p>
          You earned <strong>{score}/15</strong> first-try points. Choose a star rating
          and tell us how the next ride can improve.
        </p>

        <div className="rating-stars" aria-label="Game rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={star <= rating ? "active" : ""}
              onClick={() => setRating(star)}
              aria-label={`${star} star rating`}
              aria-pressed={star <= rating}
            >
              STAR
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What should the next mission improve?"
        />

        <button
          className="primary-btn"
          disabled={rating === 0}
          onClick={() => onSave({ rating, comment })}
        >
          {rating === 0 ? "CHOOSE A STAR RATING" : "SAVE REVIEW"}
        </button>
      </section>
    </div>
  );
}

function ResultScreen({ level, score, mistakes, runnerPoints, onHome, onReview }) {
  const stars = score === 15 ? 3 : score >= 10 ? 2 : score >= 1 ? 1 : 0;

  return (
    <main className={`app result-screen ${level}`} style={{ backgroundImage: `url(${levelInfo[level].bg})` }}>
      <div className="screen-overlay"></div>
      <SceneEffects intense />

      <section className="result-card panel-3d">
        <p className="eyebrow">MISSION COMPLETE</p>
        <h1>{score === 15 ? "PERFECT DEFENSE." : "RANGE COMPLETE."}</h1>
        <p className="result-copy">
          Your star rating is based on first-try answers. Retried questions still
          taught the right move, but they do not add a first-try point.
        </p>

        <div className="result-stars">
          {[1, 2, 3].map((star) => (
            <span className={star <= stars ? "earned" : ""} key={star}>STAR</span>
          ))}
        </div>

        <div className="result-stats">
          <div><strong>{score}/15</strong><span>first-try score</span></div>
          <div><strong>{mistakes}</strong><span>retries learned</span></div>
          <div><strong>{runnerPoints}</strong><span>bike points</span></div>
        </div>

        <div className="result-actions">
          <button className="primary-btn" onClick={onHome}>BACK TO MISSIONS</button>
          <button className="ghost-btn" onClick={onReview}>REVIEW GAME</button>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [screen, setScreen] = useState("intro");
  const [theme, setTheme] = useState(() => localStorage.getItem("hexa_theme") || "dark");
  const [musicOn, setMusicOn] = useState(true);
  const [volume, setVolume] = useState(0.16);
  const [voiceOn, setVoiceOn] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [profile, setProfile] = useState(() => readLocal("hexa_session", null));
  const [stats, setStats] = useState(defaultStats);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [pointEligible, setPointEligible] = useState(true);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [runnerPoints, setRunnerPoints] = useState(0);

  const currentTopic = useMemo(() => {
    if (!selectedLevel) return "general";

    return questions
      .filter((question) => question.level === selectedLevel)
      .sort(
        (a, b) =>
          (difficultyRank[a.originalDifficulty] ?? 0) -
          (difficultyRank[b.originalDifficulty] ?? 0)
      )[questionIndex]?.topic || "general";
  }, [questionIndex, questions, selectedLevel]);

  const musicScene = screen === "quiz" ? "quiz" : screen;
  const { primeAudio, playSfx } = useAdaptiveAudio(musicScene, currentTopic, musicOn, volume);

  const controls = {
    musicOn,
    setMusicOn,
    volume,
    setVolume,
    voiceOn,
    setVoiceOn,
    theme,
    setTheme,
    onInstructions: () => setInstructionsOpen(true)
  };

  const filteredQuestions = useMemo(() => {
    if (!selectedLevel) return [];

    return questions
      .filter((question) => question.level === selectedLevel)
      .sort(
        (a, b) =>
          (difficultyRank[a.originalDifficulty] ?? 0) -
          (difficultyRank[b.originalDifficulty] ?? 0)
      )
      .slice(0, 15)
      .map((question, index) => ({
        ...question,
        stageDifficulty: stageNames[Math.min(2, Math.floor(index / 5))]
      }));
  }, [questions, selectedLevel]);

  const currentQuestion = filteredQuestions[questionIndex];

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch("/content/questions.csv");

        if (!response.ok) throw new Error("Could not load questions.csv");

        const loadedQuestions = convertCSVToQuestions(await response.text());

        if (loadedQuestions.length === 0) throw new Error("No valid questions were found");

        setQuestions(loadedQuestions);
      } catch (error) {
        console.error(error);
        setQuestionError("Scenario bank could not be loaded.");
      } finally {
        setLoadingQuestions(false);
      }
    }

    loadQuestions();

    const timer = setTimeout(() => setScreen("portal"), 5000);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("hexa_theme", theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    setStats(readLocal(getStatsKey(profile), defaultStats));
  }, [profile]);

  const speak = useCallback(
    (text, rate = 0.95, pitch = 1) => {
      if (!voiceOn || !window.speechSynthesis) return;

      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    },
    [voiceOn]
  );

  const speakQuestion = useCallback(
    (question = currentQuestion) => {
      if (!question) return;

      speak(
        `${question.story}. ${question.question}. Option A: ${question.options[0]}. Option B: ${question.options[1]}. Option C: ${question.options[2]}. Option D: ${question.options[3]}.`,
        selectedLevel === "kids" ? 0.86 : 0.95,
        selectedLevel === "kids" ? 1.12 : 1
      );
    },
    [currentQuestion, selectedLevel, speak]
  );

  useEffect(() => {
    if (screen !== "quiz" || !currentQuestion) return;

    const timer = setTimeout(() => speakQuestion(currentQuestion), 420);
    return () => clearTimeout(timer);
  }, [currentQuestion, screen, speakQuestion]);

  function persistStats(nextStats) {
    setStats(nextStats);
    writeLocal(getStatsKey(profile), nextStats);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");

    const email = form.email.trim().toLowerCase();
    const passwordHash = await hashPassword(form.password);
    const accounts = readLocal("hexa_accounts", []);

    if (authMode === "signup") {
      if (accounts.some((account) => account.email === email)) {
        setAuthError("That email already has a local profile.");
        return;
      }

      const account = {
        name: form.name.trim(),
        email,
        passwordHash
      };

      writeLocal("hexa_accounts", [...accounts, account]);
      writeLocal("hexa_session", { name: account.name, email: account.email });
      setProfile({ name: account.name, email: account.email });
      setScreen("home");
      return;
    }

    const account = accounts.find(
      (item) => item.email === email && item.passwordHash === passwordHash
    );

    if (!account) {
      setAuthError("Local profile not found or passcode is incorrect.");
      return;
    }

    writeLocal("hexa_session", { name: account.name, email: account.email });
    setProfile({ name: account.name, email: account.email });
    setScreen("home");
  }

  function useGuest() {
    const guestProfile = { name: "Guest Player", email: "guest", guest: true };
    writeLocal("hexa_session", guestProfile);
    setProfile(guestProfile);
    setScreen("home");
  }

  function resumeSession() {
    if (profile) setScreen("home");
  }

  function logout() {
    stopSpeaking();
    localStorage.removeItem("hexa_session");
    setProfile(null);
    setScreen("portal");
  }

  function chooseLevel(level) {
    setSelectedLevel(level);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setPointEligible(true);
    setScore(0);
    setMistakes(0);
    setRunnerPoints(0);
    setScreen("quiz");
  }

  function answerQuestion(index) {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(index);

    if (index === currentQuestion.correct) {
      if (pointEligible) setScore((current) => current + 1);
      playSfx("correct");
      speak(`Correct. ${currentQuestion.explanation}. You unlocked a twenty second three D bike ride.`);
    } else {
      setMistakes((current) => current + 1);
      setPointEligible(false);
      playSfx("wrong");
      speak(`Not quite. ${currentQuestion.explanation}. Review the signal and try the question again.`);
    }
  }

  function retryQuestion() {
    setSelectedAnswer(null);
    setTimeout(() => speakQuestion(currentQuestion), 220);
  }

  function startRunner() {
    stopSpeaking();
    setScreen("runner");
  }

  function completeRunner(summary) {
    const nextRunnerPoints = runnerPoints + summary.points;
    setRunnerPoints(nextRunnerPoints);

    if (questionIndex + 1 < filteredQuestions.length) {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
      setPointEligible(true);
      setScreen("quiz");
      return;
    }

    const nextStats = {
      ...stats,
      bestScores: {
        ...stats.bestScores,
        [selectedLevel]: Math.max(stats.bestScores[selectedLevel] || 0, score)
      },
      missionsCompleted: stats.missionsCompleted + 1,
      runnerPoints: stats.runnerPoints + nextRunnerPoints
    };

    persistStats(nextStats);
    setScreen("result");
    setTimeout(() => setReviewOpen(true), 1200);
    speak(`Mission complete. Your first try score is ${score} out of 15.`);
  }

  function saveReview(review) {
    const nextStats = {
      ...stats,
      reviews: [
        ...stats.reviews,
        {
          ...review,
          level: selectedLevel,
          date: new Date().toISOString()
        }
      ]
    };

    persistStats(nextStats);
    setReviewOpen(false);
  }

  function exitToHome() {
    stopSpeaking();
    setScreen("home");
  }

  const navigation = {
    profile,
    screen,
    onHome: () => setScreen("home"),
    onDashboard: () => setScreen("dashboard"),
    onLogout: logout,
    controls
  };

  return (
    <div className="app-frame" onPointerDown={primeAudio}>
      {screen === "intro" && <IntroScreen loading={loadingQuestions} error={questionError} />}

      {screen === "portal" && (
        <PortalScreen
          authMode={authMode}
          setAuthMode={setAuthMode}
          form={form}
          setForm={setForm}
          authError={authError}
          onSubmit={handleAuthSubmit}
          onGuest={useGuest}
          savedProfile={profile}
          onResume={resumeSession}
          controls={controls}
        />
      )}

      {screen === "home" && (
        <HomeScreen
          questions={questions}
          profile={profile}
          stats={stats}
          onChooseLevel={chooseLevel}
          navigation={navigation}
          onInstructions={() => setInstructionsOpen(true)}
        />
      )}

      {screen === "dashboard" && (
        <DashboardScreen profile={profile} stats={stats} navigation={navigation} />
      )}

      {screen === "quiz" && currentQuestion && (
        <QuizScreen
          level={selectedLevel}
          question={currentQuestion}
          questionIndex={questionIndex}
          total={filteredQuestions.length}
          score={score}
          mistakes={mistakes}
          selectedAnswer={selectedAnswer}
          pointEligible={pointEligible}
          onAnswer={answerQuestion}
          onRetry={retryQuestion}
          onRun={startRunner}
          onExit={exitToHome}
          onSpeak={() => speakQuestion(currentQuestion)}
          controls={controls}
        />
      )}

      {screen === "runner" && (
        <BikeRewardStage
          level={selectedLevel}
          questionIndex={questionIndex}
          onComplete={completeRunner}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          level={selectedLevel}
          score={score}
          mistakes={mistakes}
          runnerPoints={runnerPoints}
          onHome={exitToHome}
          onReview={() => setReviewOpen(true)}
        />
      )}

      {instructionsOpen && <InstructionsModal onClose={() => setInstructionsOpen(false)} />}
      {reviewOpen && (
        <ReviewModal
          level={selectedLevel}
          score={score}
          onSave={saveReview}
          onClose={() => setReviewOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
