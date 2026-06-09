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
import hexaHomeArena from "./assets/images/hexa-home-arena.png";

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

const EMAILJS_SERVICE_ID = "service_2ybwyj8";
const EMAILJS_TEMPLATE_ID = "template_6o8hpkx";
const EMAILJS_FEEDBACK_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID || "template_vyuckxk";
const FEEDBACK_TO_EMAIL = import.meta.env.VITE_FEEDBACK_TO_EMAIL || "baaditya597@gmail.com";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "4UY1fpnsNOopkvEzu";
const EMAILJS_SEND_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const gentleLowVoiceHints = [
  "natural",
  "online",
  "neural",
  "premium",
  "aria",
  "jenny",
  "ava",
  "emma",
  "olivia",
  "samantha",
  "serena",
  "sonia",
  "susan",
  "libby",
  "maisie",
  "moira",
  "tessa",
  "karen",
  "google uk english female",
  "google us english female",
  "female",
  "woman",
  "girl"
];
const harshVoiceHints = [
  "david",
  "mark",
  "george",
  "daniel",
  "fred",
  "alex",
  "male",
  "boy"
];
const sweetLowSpeechProfile = {
  rate: 0.78,
  pitch: 0.82,
  volume: 0.9
};
const questionSpeechProfiles = {
  kids: { rate: 0.76, pitch: 0.86, volume: 0.9 },
  teens: { rate: 0.78, pitch: 0.82, volume: 0.9 },
  adults: { rate: 0.8, pitch: 0.78, volume: 0.88 }
};
const gentleVoiceFallbackHints = [
  "zira",
  "hazel",
  "heera",
  "eva",
  "victoria"
];

function pickSweetGirlVoice(voices = []) {
  if (!voices.length) return null;

  const englishVoices = voices.filter((voice) =>
    voice.lang?.toLowerCase().startsWith("en") || voice.name.toLowerCase().includes("english")
  );
  const candidates = englishVoices.length ? englishVoices : voices;

  return candidates
    .map((voice, index) => {
      const name = voice.name.toLowerCase();
      let score = 0;

      gentleLowVoiceHints.forEach((hint, hintIndex) => {
        if (name.includes(hint)) score += 60 - hintIndex;
      });

      gentleVoiceFallbackHints.forEach((hint) => {
        if (name.includes(hint)) score += 8;
      });

      if (voice.localService === false) score += 16;
      if (voice.default) score += 3;

      harshVoiceHints.forEach((hint) => {
        if (name.includes(hint)) score -= 90;
      });

      return { voice, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice;
}

function generateOtpCode() {
  if (window.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return String(buffer[0] % 1000000).padStart(6, "0");
  }

  return String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
}

function normaliseEmail(email) {
  return email.trim().toLowerCase();
}

function formatOtpInput(value) {
  return value.replace(/\D/g, "").slice(0, 6);
}

async function sendOtpEmail({ email, name, otp }) {
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error("Missing EmailJS public key. Add VITE_EMAILJS_PUBLIC_KEY to your .env file.");
  }

  const response = await fetch(EMAILJS_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: email,
        to_name: name || email.split("@")[0],
        otp_code: otp,
        app_name: "HEXA Cyber Range"
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "EmailJS could not send the verification code.");
  }
}

async function sendFeedbackEmail({ profile, level, score, rating, comment }) {
  if (!EMAILJS_PUBLIC_KEY) {
    throw new Error("Missing EmailJS public key. Add VITE_EMAILJS_PUBLIC_KEY to your .env file.");
  }

  const playerName = profile?.name?.trim() || "Verified HEXA Player";
  const playerEmail = profile?.email || FEEDBACK_TO_EMAIL;
  const submittedAt = new Date().toLocaleString();

  const response = await fetch(EMAILJS_SEND_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_FEEDBACK_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: FEEDBACK_TO_EMAIL,
        player_name: playerName,
        player_email: playerEmail,
        rating: String(rating),
        category: "Game Review",
        game_mode: levelInfo[level]?.title || level || "HEXA Mission",
        score: `${score}/15`,
        feedback_message: comment?.trim() || "No written feedback provided.",
        submitted_at: submittedAt,
        app_name: "HEXA Cyber Range"
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "EmailJS could not send the feedback email.");
  }

  return submittedAt;
}

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
  return `hexa_stats_${profile?.email || "unverified"}`;
}

function stopSpeaking() {
  window.speechSynthesis?.cancel();
}

function createReverbImpulse(context, duration = 2.8, decay = 2.7) {
  const frameCount = Math.floor(context.sampleRate * duration);
  const impulse = context.createBuffer(2, frameCount, context.sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const data = impulse.getChannelData(channel);

    for (let index = 0; index < frameCount; index++) {
      const envelope = (1 - index / frameCount) ** decay;
      data[index] = (Math.random() * 2 - 1) * envelope;
    }
  }

  return impulse;
}

function useAdaptiveAudio(scene, topic, mode, enabled, volume) {
  const engineRef = useRef(null);
  const intervalRef = useRef(null);
  const stepRef = useRef(0);
  const startedRef = useRef(false);
  const [audioRevision, setAudioRevision] = useState(0);

  const stopMusic = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const createTone = useCallback((frequency, duration, gainValue, type = "sine", options = {}) => {
    const engine = engineRef.current;

    if (!engine || engine.context.state !== "running") return;

    const oscillator = engine.context.createOscillator();
    const filter = engine.context.createBiquadFilter();
    const gain = engine.context.createGain();
    const panner = engine.context.createStereoPanner?.();
    const now = engine.context.currentTime;
    const attack = Math.min(options.attack ?? 0.035, duration * 0.35);
    const releaseStart = Math.max(now + attack + 0.01, now + duration - (options.release ?? 0.16));

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.detune.value = options.detune ?? 0;
    filter.type = options.filterType || "lowpass";
    filter.frequency.value = options.filter ?? 5200;
    filter.Q.value = options.resonance ?? 0.35;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue), now + attack);
    gain.gain.setValueAtTime(Math.max(0.0002, gainValue * 0.82), releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.value = options.pan ?? 0;
      gain.connect(panner);
      panner.connect(options.sfx ? engine.sfxBus : engine.musicBus);
      if ((options.reverb ?? 0.2) > 0) panner.connect(engine.reverbInput);
    } else {
      gain.connect(options.sfx ? engine.sfxBus : engine.musicBus);
      if ((options.reverb ?? 0.2) > 0) gain.connect(engine.reverbInput);
    }

    oscillator.start(now);
    oscillator.stop(now + duration + 0.08);
  }, []);

  const createNoise = useCallback((duration, gainValue, options = {}) => {
    const engine = engineRef.current;

    if (!engine || engine.context.state !== "running") return;

    const source = engine.context.createBufferSource();
    const filter = engine.context.createBiquadFilter();
    const gain = engine.context.createGain();
    const panner = engine.context.createStereoPanner?.();
    const now = engine.context.currentTime;

    source.buffer = engine.noiseBuffer;
    filter.type = options.filterType || "bandpass";
    filter.frequency.value = options.filter ?? 1400;
    filter.Q.value = options.resonance ?? 0.8;
    gain.gain.setValueAtTime(Math.max(0.0002, gainValue), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(gain);

    if (panner) {
      panner.pan.value = options.pan ?? 0;
      gain.connect(panner);
      panner.connect(options.sfx ? engine.sfxBus : engine.musicBus);
    } else {
      gain.connect(options.sfx ? engine.sfxBus : engine.musicBus);
    }

    source.start(now);
    source.stop(now + duration);
  }, []);

  const playSfx = useCallback(
    (kind) => {
      if (!engineRef.current || !enabled) return;

      if (kind === "correct") {
        createTone(523.25, 0.2, 0.13, "triangle", { sfx: true, pan: -0.18, filter: 7600 });
        setTimeout(() => createTone(783.99, 0.34, 0.11, "triangle", { sfx: true, pan: 0.18, filter: 8200 }), 120);
      } else if (kind === "wrong") {
        createTone(196, 0.22, 0.1, "sawtooth", { sfx: true, filter: 1300 });
        setTimeout(() => createTone(146.83, 0.32, 0.08, "sawtooth", { sfx: true, filter: 900 }), 120);
      } else if (kind === "collect") {
        createTone(880, 0.12, 0.07, "square", { sfx: true, pan: 0.25, filter: 9000 });
      } else if (kind === "impact") {
        createTone(92.5, 0.28, 0.12, "sawtooth", { sfx: true, filter: 500 });
        createNoise(0.18, 0.08, { sfx: true, filter: 420, resonance: 1.4 });
      }
    },
    [createNoise, createTone, enabled]
  );

  const primeAudio = useCallback(async () => {
    if (!engineRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) return;

      let context;

      try {
        context = new AudioContext({ latencyHint: "interactive", sampleRate: 48000 });
      } catch {
        context = new AudioContext();
      }

      const master = context.createGain();
      const musicBus = context.createGain();
      const sfxBus = context.createGain();
      const compressor = context.createDynamicsCompressor();
      const reverbInput = context.createGain();
      const convolver = context.createConvolver();
      const reverbGain = context.createGain();
      const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);

      for (let index = 0; index < noiseData.length; index++) {
        noiseData[index] = Math.random() * 2 - 1;
      }

      master.gain.value = enabled ? volume : 0.0001;
      musicBus.gain.value = 1.08;
      sfxBus.gain.value = 1;
      reverbInput.gain.value = 0.18;
      reverbGain.gain.value = 0.3;
      compressor.threshold.value = -14;
      compressor.knee.value = 10;
      compressor.ratio.value = 10;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.2;
      convolver.buffer = createReverbImpulse(context);

      musicBus.connect(master);
      sfxBus.connect(master);
      reverbInput.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(master);
      master.connect(compressor);
      compressor.connect(context.destination);
      engineRef.current = {
        context,
        master,
        musicBus,
        sfxBus,
        reverbInput,
        noiseBuffer
      };
    }

    if (engineRef.current.context.state === "suspended") {
      await engineRef.current.context.resume();
    }

    if (!startedRef.current) {
      startedRef.current = true;
      setAudioRevision((current) => current + 1);
    }
  }, [enabled, volume]);

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

    const modeIdentity = {
      kids: { shift: 0, wave: "triangle", warmth: 4600, pan: 0.42 },
      teens: { shift: 3, wave: "sawtooth", warmth: 3400, pan: 0.7 },
      adults: { shift: -2, wave: "sine", warmth: 2600, pan: 0.3 }
    }[mode] || { shift: 0, wave: "triangle", warmth: 3900, pan: 0.5 };

    const config = {
      intro: { root: 110, pattern: [0, 7, 12, 7], chord: [0, 7, 12], pace: 520, energy: 0.34, level: 1 },
      portal: { root: 130.81, pattern: [0, 3, 7, 10, 12, 10, 7, 3], chord: [0, 3, 7, 10], pace: 330, energy: 0.74, level: 1.85, sparkle: true },
      home: { root: 146.83, pattern: [0, 7, 10, 12, 14, 12, 10, 7], chord: [0, 7, 10, 14], pace: 300, energy: 0.82, level: 2, sparkle: true },
      modes: { root: 155.56, pattern: [0, 5, 7, 12, 10, 7], chord: [0, 5, 10], pace: 330, energy: 0.62, level: 1.2 },
      dashboard: { root: 164.81, pattern: [0, 4, 7, 11], chord: [0, 4, 11], pace: 430, energy: 0.44, level: 1 },
      quiz: { root: 138.59, pattern: [0, 7, 3, 10, 5, 12], chord: [0, 3, 7], pace: 300, energy: 0.66, level: 1.1 },
      runner: { root: 174.61, pattern: [0, 12, 7, 15, 10, 7, 12, 17], chord: [0, 7, 12], pace: 175, energy: 1, level: 1.2 },
      result: { root: 196, pattern: [0, 4, 7, 12, 7, 4], chord: [0, 4, 7], pace: 390, energy: 0.52, level: 1.1 }
    }[scene] || { root: 130.81, pattern: [0, 7, 12, 7], chord: [0, 7, 12], pace: 400, energy: 0.5, level: 1 };

    stepRef.current = 0;

    function pulse() {
      const step = stepRef.current++;
      const semitone = config.pattern[step % config.pattern.length];
      const adjustedShift = (scene === "quiz" ? topicShift : 0) + modeIdentity.shift;
      const frequency = config.root * 2 ** ((semitone + adjustedShift) / 12);
      const pan = Math.sin(step * 0.82) * modeIdentity.pan;

      createTone(
        frequency,
        scene === "runner" ? 0.19 : 0.52,
        (0.022 + config.energy * 0.012) * config.level,
        modeIdentity.wave,
        { pan, filter: modeIdentity.warmth + config.energy * 1800, reverb: 0.24 }
      );

      if (step % 4 === 0) {
        createTone(config.root / 2, scene === "runner" ? 0.24 : 0.46, (0.032 + config.energy * 0.012) * config.level, "sine", {
          filter: 740,
          release: 0.2,
          reverb: 0.08
        });
      }

      if (step % 8 === 0) {
        config.chord.forEach((note, index) => {
          const chordFrequency = config.root * 2 ** ((note + modeIdentity.shift) / 12);
          createTone(chordFrequency, scene === "runner" ? 1.1 : 2.35, 0.0075 * config.level, "sine", {
            attack: 0.28,
            release: 0.7,
            detune: (index - (config.chord.length - 1) / 2) * 5,
            filter: modeIdentity.warmth,
            pan: (index - (config.chord.length - 1) / 2) * 0.38,
            reverb: 0.4
          });
        });
      }

      if (config.sparkle && step % 2 === 1) {
        createTone(frequency * 2, 0.2, 0.012 * config.level, "sine", {
          attack: 0.012,
          release: 0.12,
          filter: 9800,
          pan: -pan,
          reverb: 0.38
        });
      }

      if (config.sparkle && step % 4 === 0) {
        createTone(config.root / 4, 0.7, 0.032 * config.level, "triangle", {
          filter: 420,
          release: 0.35,
          pan: 0,
          reverb: 0.04
        });
      }

      if (config.energy > 0.58 && step % (scene === "runner" ? 2 : 4) === 2) {
        createNoise(scene === "runner" ? 0.08 : 0.12, (0.009 + config.energy * 0.007) * config.level, {
          filter: scene === "runner" ? 4200 : 2600,
          resonance: 1.1,
          pan: -pan * 0.6
        });
      }
    }

    pulse();
    intervalRef.current = setInterval(pulse, config.pace);

    return stopMusic;
  }, [audioRevision, createNoise, createTone, enabled, mode, scene, stopMusic, topic]);

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

function SceneEffects({ intense = false, logoPalette = false }) {
  return (
    <div
      className={`scene-effects ${intense ? "intense" : ""} ${logoPalette ? "logo-palette" : ""}`}
      aria-hidden="true"
    >
      <span className="grid-floor"></span>
      <span className="scene-orbit scene-orbit-one"></span>
      <span className="scene-orbit scene-orbit-two"></span>
      <span className="hex-spark spark-one"></span>
      <span className="hex-spark spark-two"></span>
      <span className="hex-spark spark-three"></span>
      <span className="scan-beam"></span>
      <span className="light-column column-one"></span>
      <span className="light-column column-two"></span>
      {logoPalette && (
        <>
          <span className="brand-aura aura-blue"></span>
          <span className="brand-aura aura-orange"></span>
          <span className="energy-ribbon ribbon-blue"></span>
          <span className="energy-ribbon ribbon-orange"></span>
          <span className="brand-particle particle-one"></span>
          <span className="brand-particle particle-two"></span>
          <span className="brand-particle particle-three"></span>
          <span className="brand-particle particle-four"></span>
          <span className="brand-particle particle-five"></span>
          <span className="brand-particle particle-six"></span>
        </>
      )}
    </div>
  );
}

function HomeArenaEffects() {
  return (
    <div className="home-arena-effects" aria-hidden="true">
      <span className="arena-perspective-grid"></span>
      <span className="arena-data-lane lane-one"></span>
      <span className="arena-data-lane lane-two"></span>
      <span className="arena-data-lane lane-three"></span>
      <span className="arena-scan scan-one"></span>
      <span className="arena-scan scan-two"></span>
      <span className="arena-hex-ring ring-blue"></span>
      <span className="arena-hex-ring ring-orange"></span>
      <span className="arena-pulse pulse-one"></span>
      <span className="arena-pulse pulse-two"></span>
      <span className="arena-depth-glow glow-blue"></span>
      <span className="arena-depth-glow glow-orange"></span>
      <span className="arena-flame flame-blue flame-blue-one"></span>
      <span className="arena-flame flame-blue flame-blue-two"></span>
      <span className="arena-flame flame-orange flame-orange-one"></span>
      <span className="arena-flame flame-orange flame-orange-two"></span>
      <span className="arena-energy-arc arc-blue"></span>
      <span className="arena-energy-arc arc-orange"></span>
      <span className="arena-ember ember-one"></span>
      <span className="arena-ember ember-two"></span>
      <span className="arena-ember ember-three"></span>
      <span className="arena-ember ember-four"></span>
      <span className="arena-ember ember-five"></span>
      <span className="arena-ember ember-six"></span>
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
          max="1"
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
    <main className="app intro-screen arena-screen" style={{ backgroundImage: `url(${hexaHomeArena})` }}>
      <div className="home-overlay"></div>
      <HomeArenaEffects />

      <section className="intro-content">
        <p className="eyebrow">INITIALIZING CYBER RANGE</p>
        <h1>
          <span>TEAM</span>
          <strong>HEXA</strong>
        </h1>
        <p className="intro-status">
          {error || (loading ? "Loading verified scenarios..." : "Secure link established")}
        </p>
        <div className="intro-loader"><span></span></div>
        <small>Tap anywhere to unlock the UHD adaptive soundtrack.</small>
      </section>
    </main>
  );
}

function PortalScreen({
  form,
  setForm,
  authError,
  otpStatus,
  otpStep,
  sendingOtp,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  onChangeEmail,
  onGuestLogin,
  controls
}) {
  return (
    <main className="app portal-screen arena-screen" style={{ backgroundImage: `url(${hexaHomeArena})` }}>
      <div className="home-overlay"></div>
      <HomeArenaEffects />
      <AudioDock {...controls} compact />

      <section className="portal-layout">
        <div className="portal-copy">
          <p className="eyebrow">SECURE PLAYER TERMINAL</p>
          <h1>Choose your entry.</h1>
          <p>
            Verify your email for a named profile, or jump straight into the
            cyber range as a guest.
          </p>
          <div className="terminal-lines">
            <span><i></i> EMAILJS SERVICE CONNECTED</span>
            <span><i></i> 6-DIGIT SECURE LOGIN AVAILABLE</span>
            <span><i></i> GUEST TRAINING ACCESS READY</span>
          </div>
        </div>

        <section className="terminal-card panel-3d">
          <div className="terminal-bar">
            <span>HEXA_ACCESS_GATE</span>
            <span>SECURE OR GUEST ACCESS</span>
          </div>

          <div className="otp-stepper" aria-label="Verification progress">
            <span className={otpStep === "email" ? "active" : "complete"}>1. SEND CODE</span>
            <span className={otpStep === "verify" ? "active" : ""}>2. VERIFY OTP</span>
          </div>

          {otpStep === "email" ? (
            <form onSubmit={onSendOtp}>
              <label>
                <span>YOUR NAME</span>
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your display name"
                  autoComplete="name"
                />
              </label>

              <label>
                <span>GMAIL / EMAIL ADDRESS</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="yourgmail@gmail.com"
                  autoComplete="email"
                />
              </label>

              {authError && <p className="form-error">{authError}</p>}
              {otpStatus && <p className="form-success">{otpStatus}</p>}

              <button className="primary-btn" type="submit" disabled={sendingOtp}>
                {sendingOtp ? "SENDING CODE..." : "SEND GMAIL VERIFICATION CODE"}
              </button>
            </form>
          ) : (
            <form onSubmit={onVerifyOtp}>
              <div className="otp-sent-box">
                <span>Code sent to</span>
                <strong>{normaliseEmail(form.email)}</strong>
              </div>

              <label>
                <span>6-DIGIT VERIFICATION CODE</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  value={form.otp}
                  onChange={(event) =>
                    setForm({ ...form, otp: formatOtpInput(event.target.value) })
                  }
                  placeholder="Enter 6 digit code"
                  autoComplete="one-time-code"
                />
              </label>

              {authError && <p className="form-error">{authError}</p>}
              {otpStatus && <p className="form-success">{otpStatus}</p>}

              <button className="primary-btn" type="submit">
                VERIFY & OPEN GAME
              </button>

              <div className="otp-actions">
                <button type="button" onClick={onResendOtp} disabled={sendingOtp}>
                  {sendingOtp ? "SENDING..." : "RESEND CODE"}
                </button>
                <button type="button" onClick={onChangeEmail}>
                  CHANGE EMAIL
                </button>
              </div>
            </form>
          )}

          <div className="guest-entry">
            <span>OR ENTER WITHOUT EMAIL</span>
            <button className="guest-btn" type="button" onClick={onGuestLogin}>
              CONTINUE AS GUEST
            </button>
          </div>

          <small>
            Guest progress is stored locally on this device. Email verification creates
            a named player profile.
          </small>
        </section>
      </section>
    </main>
  );
}

function TopNavigation({ profile, screen, onHome, onModes, onDashboard, onLogout, controls }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(target) {
    target();
    setMenuOpen(false);
  }

  return (
    <header className="home-nav app-nav">
      <button className="brand brand-button" onClick={() => goTo(onHome)}>
        <HexMark small />
        <span>HEXA <b>/</b> CYBER RANGE</span>
      </button>

      <div className="nav-profile">
        <span>{profile?.name || "Verified Player"}</span>
      </div>

      <div className="hamburger-wrap">
        <button
          className={`hamburger-button ${menuOpen ? "active" : ""}`}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {menuOpen && (
          <nav className="hamburger-menu">
            <button className={screen === "home" ? "active" : ""} onClick={() => goTo(onHome)}>HOME SCREEN</button>
            <button className={screen === "modes" ? "active" : ""} onClick={() => goTo(onModes)}>3 GAME MODES</button>
            <button className={screen === "dashboard" ? "active" : ""} onClick={() => goTo(onDashboard)}>DASHBOARD</button>
            <button className="danger" onClick={() => goTo(onLogout)}>LOG OUT</button>
          </nav>
        )}
      </div>

      <AudioDock {...controls} compact />
    </header>
  );
}

function HomeScreen({
  profile,
  navigation,
  onInstructions,
  onOpenModes
}) {
  return (
    <main className="app home-screen arena-screen fixed-page" style={{ backgroundImage: `url(${hexaHomeArena})` }}>
      <div className="home-overlay"></div>
      <HomeArenaEffects />

      <section className="home-shell one-page-home-shell">
        <TopNavigation {...navigation} />

        <section className="home-one-page-layout">
          <div className="hero home-hero-fixed">
            <div className="home-brand-bounce">
              <img src={hexaGroupLogo} alt="" />
              <span>HEXA</span>
            </div>
            <p className="eyebrow">WELCOME BACK, {(profile?.name || "VERIFIED PLAYER").toUpperCase()}</p>
            <h1>
              THINK FAST.
              <span>RUN SMART.</span>
            </h1>
            <p className="hero-copy">
              Your game home is now a single fixed screen. Use the hamburger menu or
              the launch button to open the 3 mode selection page.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={onOpenModes}>OPEN 3 MODES</button>
              <button className="ghost-btn" onClick={onInstructions}>HOW TO PLAY</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function ModesScreen({
  questions,
  stats,
  onChooseLevel,
  navigation
}) {
  return (
    <main className="app modes-screen arena-screen fixed-page" style={{ backgroundImage: `url(${hexaHomeArena})` }}>
      <div className="home-overlay"></div>
      <HomeArenaEffects />

      <section className="home-shell modes-shell">
        <TopNavigation {...navigation} />

        <section className="modes-page-head">
          <div>
            <p className="eyebrow">SELECT GAME MODE</p>
            <h1>Choose your cyber mission</h1>
          </div>
          <p>
            Pick one of the 3 modes below. Use the hamburger icon to return to the
            home screen anytime.
          </p>
        </section>

        <section className="mode-section modes-page-section">
          <div className="level-grid modes-page-grid">
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
          <h1>{profile?.name || "Verified Player"} / Range report</h1>
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
  const bikeControlKeys = useMemo(
    () => new Set(["a", "d", "w", "s", "arrowleft", "arrowright", "arrowup", "arrowdown", "p"]),
    []
  );

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  const focusBikeFrame = useCallback(() => {
    frameRef.current?.focus();
    frameRef.current?.contentWindow?.focus();
  }, []);

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
        reason: event.data.reason === "quit" ? "quit" : "complete",
        points: Number(event.data.points) || 0,
        collected: Number(event.data.collected) || 0,
        crashes: Number(event.data.crashes) || 0
      });
    }

    window.addEventListener("message", receiveBikeSummary);
    return () => window.removeEventListener("message", receiveBikeSummary);
  }, []);

  useEffect(() => {
    function relayBikeKey(event, isDown) {
      const key = event.key.toLowerCase();

      if (!bikeControlKeys.has(key)) return;

      event.preventDefault();
      frameRef.current?.contentWindow?.postMessage(
        {
          type: "hexa-bike-key",
          key,
          isDown
        },
        window.location.origin
      );
    }

    const onKeyDown = (event) => relayBikeKey(event, true);
    const onKeyUp = (event) => relayBikeKey(event, false);

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
    };
  }, [bikeControlKeys]);

  return (
    <main className={`app bike-reward-screen ${level}`}>
      <iframe
        ref={frameRef}
        className="bike-game-frame"
        src={src}
        title={`${levelInfo[level].title} 3D bike reward stage`}
        allow="autoplay"
        tabIndex="0"
        onLoad={focusBikeFrame}
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

            <div className="quiz-card-grid">
              <div className="quiz-prompt-column">
                <div className="scenario-brief">
                  <span className="brief-label">SITUATION REPORT</span>
                  <p>{question.story}</p>
                </div>

                <h2>{question.question}</h2>
              </div>

              <div className="quiz-response-column">
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
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ReviewModal({ level, score, profile, onSave, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const modeTitle = levelInfo[level]?.title || "HEXA";

  async function handleSendFeedback() {
    if (rating === 0 || sendingFeedback) return;

    setFeedbackError("");
    setSendingFeedback(true);

    try {
      const emailedAt = await sendFeedbackEmail({
        profile,
        level,
        score,
        rating,
        comment
      });

      onSave({ rating, comment, emailedAt });
    } catch (error) {
      console.error(error);
      setFeedbackError(error.message || "Could not send feedback to Gmail. Please check EmailJS settings.");
    } finally {
      setSendingFeedback(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="modal-panel review-panel panel-3d" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close review">X</button>
        <p className="eyebrow">MODE COMPLETE | GMAIL FEEDBACK</p>
        <h2>Send feedback for your {modeTitle} run.</h2>
        <p>
          You earned <strong>{score}/15</strong> first-try points. Your review will be
          sent to <strong>{FEEDBACK_TO_EMAIL}</strong> through the same EmailJS Gmail service.
        </p>

        <div className="feedback-recipient">
          <span>From</span>
          <strong>{profile?.name || "Verified Player"}</strong>
          <small>{profile?.email || "Verified Gmail account"}</small>
        </div>

        <div className="rating-stars" aria-label="Game rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={star <= rating ? "active" : ""}
              onClick={() => setRating(star)}
              aria-label={`${star} star rating`}
              aria-pressed={star <= rating}
              disabled={sendingFeedback}
            >
              STAR
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="What should the next mission improve?"
          disabled={sendingFeedback}
        />

        {feedbackError && <p className="form-error">{feedbackError}</p>}

        <button
          className="primary-btn"
          disabled={rating === 0 || sendingFeedback}
          onClick={handleSendFeedback}
        >
          {sendingFeedback
            ? "SENDING TO GMAIL..."
            : rating === 0
              ? "CHOOSE A STAR RATING"
              : "SEND FEEDBACK TO GMAIL"}
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
  const [volume, setVolume] = useState(1);
  const [voiceOn, setVoiceOn] = useState(true);
  const [narrationVoice, setNarrationVoice] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(defaultStats);
  const [authError, setAuthError] = useState("");
  const [otpStatus, setOtpStatus] = useState("");
  const [otpStep, setOtpStep] = useState("email");
  const [otpRequest, setOtpRequest] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", otp: "" });
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
  const { primeAudio, playSfx } = useAdaptiveAudio(
    musicScene,
    currentTopic,
    selectedLevel,
    musicOn,
    volume
  );

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
    const protectedScreens = ["home", "modes", "dashboard", "quiz", "runner", "result"];

    if (!profile && protectedScreens.includes(screen)) {
      setScreen("portal");
    }
  }, [profile, screen]);

  useEffect(() => {
    setStats(readLocal(getStatsKey(profile), defaultStats));
  }, [profile]);

  useEffect(() => {
    if (!window.speechSynthesis) return;

    function loadNarrationVoice() {
      setNarrationVoice(pickSweetGirlVoice(window.speechSynthesis.getVoices()));
    }

    loadNarrationVoice();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadNarrationVoice);

    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadNarrationVoice);
    };
  }, []);

  const speak = useCallback(
    (text, profile = sweetLowSpeechProfile) => {
      if (!voiceOn || !window.speechSynthesis) return;

      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = narrationVoice || pickSweetGirlVoice(window.speechSynthesis.getVoices());

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-GB";
      } else {
        utterance.lang = "en-GB";
      }

      utterance.rate = profile.rate;
      utterance.pitch = profile.pitch;
      utterance.volume = profile.volume;
      window.speechSynthesis.speak(utterance);
    },
    [narrationVoice, voiceOn]
  );

  const speakQuestion = useCallback(
    (question = currentQuestion) => {
      if (!question) return;

      speak(
        `${question.story}. ${question.question}. Option A: ${question.options[0]}. Option B: ${question.options[1]}. Option C: ${question.options[2]}. Option D: ${question.options[3]}.`,
        questionSpeechProfiles[selectedLevel] || sweetLowSpeechProfile
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

  async function requestOtp({ keepOtpValue = false } = {}) {
    setAuthError("");
    setOtpStatus("");

    const email = normaliseEmail(form.email);
    const name = form.name.trim();

    if (!name) {
      setAuthError("Please enter your name before requesting the code.");
      return;
    }

    if (!email || !email.includes("@")) {
      setAuthError("Please enter a valid Gmail or email address.");
      return;
    }

    const otp = generateOtpCode();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    setSendingOtp(true);

    try {
      await sendOtpEmail({ email, name, otp });
      setOtpRequest({ email, name, otp, expiresAt });
      setOtpStep("verify");
      setForm((current) => ({
        ...current,
        email,
        name,
        otp: keepOtpValue ? current.otp : ""
      }));
      setOtpStatus("A real 6-digit verification code has been sent to your email. It expires in 5 minutes.");
    } catch (error) {
      console.error(error);
      setAuthError(error.message || "Could not send the Gmail verification code. Please check EmailJS settings.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleSendOtp(event) {
    event.preventDefault();
    await requestOtp();
  }

  async function handleResendOtp() {
    await requestOtp();
  }

  function handleChangeEmail() {
    setOtpStep("email");
    setOtpRequest(null);
    setAuthError("");
    setOtpStatus("");
    setForm((current) => ({ ...current, otp: "" }));
  }

  function handleVerifyOtp(event) {
    event.preventDefault();
    setAuthError("");
    setOtpStatus("");

    const submittedOtp = formatOtpInput(form.otp);
    const email = normaliseEmail(form.email);

    if (!otpRequest || otpRequest.email !== email) {
      setAuthError("Please request a fresh verification code for this email.");
      setOtpStep("email");
      return;
    }

    if (Date.now() > otpRequest.expiresAt) {
      setAuthError("This verification code has expired. Please resend a new code.");
      return;
    }

    if (submittedOtp !== otpRequest.otp) {
      setAuthError("Incorrect verification code. Please check your Gmail and enter the 6 digits exactly.");
      return;
    }

    const verifiedProfile = { name: otpRequest.name, email: otpRequest.email, verifiedAt: new Date().toISOString() };
    setProfile(verifiedProfile);
    setOtpRequest(null);
    setForm({ name: otpRequest.name, email: otpRequest.email, otp: "" });
    setScreen("home");
  }

  function handleGuestLogin() {
    setAuthError("");
    setOtpStatus("");
    setOtpRequest(null);
    setProfile({
      name: "Guest Player",
      email: "guest@hexa.local",
      isGuest: true,
      verifiedAt: null
    });
    setScreen("home");
  }

  function logout() {
    stopSpeaking();
    setProfile(null);
    setOtpStep("email");
    setOtpRequest(null);
    setAuthError("");
    setOtpStatus("");
    setForm({ name: "", email: "", otp: "" });
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
      speak(`Great job. ${currentQuestion.explanation}. You unlocked a twenty second three D bike ride.`);
    } else {
      setMistakes((current) => current + 1);
      setPointEligible(false);
      playSfx("wrong");
      speak(`Good try. ${currentQuestion.explanation}. Review the signal, and try the question again.`);
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
    if (summary.reason === "quit") {
      stopSpeaking();
      setScreen("home");
      return;
    }

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
    speak(`Mission complete. Nice work. Your first try score is ${score} out of 15.`);
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
    onHome: () => setScreen(profile ? "home" : "portal"),
    onModes: () => setScreen(profile ? "modes" : "portal"),
    onDashboard: () => setScreen(profile ? "dashboard" : "portal"),
    onLogout: logout,
    controls
  };

  return (
    <div className="app-frame" onPointerDown={primeAudio}>
      {screen === "intro" && <IntroScreen loading={loadingQuestions} error={questionError} />}

      {screen === "portal" && (
        <PortalScreen
          form={form}
          setForm={setForm}
          authError={authError}
          otpStatus={otpStatus}
          otpStep={otpStep}
          sendingOtp={sendingOtp}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onChangeEmail={handleChangeEmail}
          onGuestLogin={handleGuestLogin}
          controls={controls}
        />
      )}

      {screen === "home" && profile && (
        <HomeScreen
          profile={profile}
          stats={stats}
          navigation={navigation}
          onInstructions={() => setInstructionsOpen(true)}
          onOpenModes={() => setScreen("modes")}
        />
      )}

      {screen === "modes" && profile && (
        <ModesScreen
          questions={questions}
          stats={stats}
          onChooseLevel={chooseLevel}
          navigation={navigation}
        />
      )}

      {screen === "dashboard" && profile && (
        <DashboardScreen profile={profile} stats={stats} navigation={navigation} />
      )}

      {screen === "quiz" && profile && currentQuestion && (
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

      {screen === "runner" && profile && (
        <BikeRewardStage
          level={selectedLevel}
          questionIndex={questionIndex}
          onComplete={completeRunner}
        />
      )}

      {screen === "result" && profile && (
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
          profile={profile}
          onSave={saveReview}
          onClose={() => setReviewOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
