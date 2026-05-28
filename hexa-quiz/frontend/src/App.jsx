import { useEffect, useState } from "react";

import kidsBg from "./assets/images/kids-bg.png";
import teensBg from "./assets/images/teens-bg.png";
import adultsBg from "./assets/images/adults-bg.png";

const levelInfo = {
  kids: {
    title: "Kids Mode",
    subtitle: "CyberWorld Adventure",
    mascot: "🤖",
    bg: kidsBg,
    theme: "kids"
  },
  teens: {
    title: "Teens Mode",
    subtitle: "CyberCity Underground",
    mascot: "🧑‍💻",
    bg: teensBg,
    theme: "teens"
  },
  adults: {
    title: "Adults Mode",
    subtitle: "CyberOffice Intel",
    mascot: "🛡️",
    bg: adultsBg,
    theme: "adults"
  }
};

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      i++;
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

      if (char === "\r" && nextChar === "\n") {
        i++;
      }
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

function convertCSVToQuestions(csvText) {
  const rows = parseCSV(csvText);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header.trim().replace("\ufeff", "")
  );

  const questions = rows
    .slice(1)
    .filter((row) => row.length > 1)
    .map((row) => {
      const item = {};

      headers.forEach((header, index) => {
        item[header] = row[index] ? row[index].trim() : "";
      });

      let level = "";

      if (item.level) {
        level = item.level.toLowerCase().trim();
      } else if (item.age_group) {
        level = item.age_group.toLowerCase().trim();
      }

      if (level === "children" || level === "child") {
        level = "kids";
      }

      return {
        id: Number(item.id),
        level: level,
        topic: item.topic || "general",
        difficulty: item.difficulty || "Easy",
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
        characterEmotion: item.character_emotion || "",
        backgroundFile: item.background_file || "",
        audioFile: item.audio_file || "",
        isActive: item.is_active !== "false"
      };
    })
    .filter((question) => question.isActive);

  return questions;
}

function convertCorrectOption(correctOption) {
  const answer = String(correctOption).trim().toUpperCase();

  if (answer === "A") return 0;
  if (answer === "B") return 1;
  if (answer === "C") return 2;
  if (answer === "D") return 3;

  return 0;
}

function formatTopic(topic) {
  return topic
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState("");

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    async function loadQuestionsFromCSV() {
      try {
        const response = await fetch("/content/questions.csv");

        if (!response.ok) {
          throw new Error("Could not load questions.csv");
        }

        const csvText = await response.text();
        const loadedQuestions = convertCSVToQuestions(csvText);

        setQuestions(loadedQuestions);
        setLoadingQuestions(false);
      } catch (error) {
        console.error(error);
        setQuestionError(
          "Questions could not be loaded. Check frontend/public/content/questions.csv"
        );
        setLoadingQuestions(false);
      }
    }

    loadQuestionsFromCSV();
  }, []);

  const filteredQuestions = selectedLevel
    ? questions.filter((question) => question.level === selectedLevel)
    : [];

  const currentQuestion = filteredQuestions[questionIndex];

  function speakQuestion(questionData) {
    if (!voiceOn || !questionData) return;

    window.speechSynthesis.cancel();

    const textToRead = `
      ${questionData.story}.
      ${questionData.question}.
      Option A: ${questionData.options[0]}.
      Option B: ${questionData.options[1]}.
      Option C: ${questionData.options[2]}.
      Option D: ${questionData.options[3]}.
    `;

    const speech = new SpeechSynthesisUtterance(textToRead);
    speech.rate = selectedLevel === "kids" ? 0.85 : 0.95;
    speech.pitch = selectedLevel === "kids" ? 1.2 : 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  }

  function speakFeedback(text) {
    if (!voiceOn) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  }

  function chooseLevel(level) {
    const levelQuestions = questions.filter((question) => question.level === level);

    if (levelQuestions.length === 0) {
      alert(`No questions found for ${level}. Check your CSV level column.`);
      return;
    }

    setSelectedLevel(level);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);

    setTimeout(() => {
      speakQuestion(levelQuestions[0]);
    }, 500);
  }

  function answerQuestion(index) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === currentQuestion.correct) {
      setScore(score + 1);
      speakFeedback("Correct! " + currentQuestion.explanation);
    } else {
      speakFeedback("Not quite. " + currentQuestion.explanation);
    }
  }

  function nextQuestion() {
    if (questionIndex + 1 < filteredQuestions.length) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);

      setTimeout(() => {
        speakQuestion(filteredQuestions[nextIndex]);
      }, 400);
    } else {
      setFinished(true);
      window.speechSynthesis.cancel();

      const finalScore =
        selectedAnswer === currentQuestion.correct ? score + 1 : score;

      speakFeedback(
        `Quiz complete. Your score is ${finalScore} out of ${filteredQuestions.length}.`
      );
    }
  }

  function restart() {
    window.speechSynthesis.cancel();
    setSelectedLevel(null);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  function replayVoice() {
    if (currentQuestion) {
      speakQuestion(currentQuestion);
    }
  }

  if (loadingQuestions) {
    return (
      <main className="app home-screen">
        <div className="animated-bg">
          <span className="blob blob1"></span>
          <span className="blob blob2"></span>
          <span className="blob blob3"></span>
          <span className="cyber-line line1"></span>
          <span className="cyber-line line2"></span>
        </div>

        <section className="hero">
          <div className="badge">Loading Questions</div>
          <h1>Hexa Quiz</h1>
          <p>Loading your cyber safety questions...</p>
        </section>
      </main>
    );
  }

  if (questionError) {
    return (
      <main className="app home-screen">
        <section className="hero">
          <div className="badge">Error</div>
          <h1>Hexa Quiz</h1>
          <p>{questionError}</p>
        </section>
      </main>
    );
  }

  if (!selectedLevel) {
    return (
      <main className="app home-screen">
        <div className="animated-bg">
          <span className="blob blob1"></span>
          <span className="blob blob2"></span>
          <span className="blob blob3"></span>
          <span className="cyber-line line1"></span>
          <span className="cyber-line line2"></span>
        </div>

        <section className="hero">
          

          <h1>Hexa Quiz</h1>

          <p>
            Learn the rules of the internet — before someone breaks them.
          </p>

          <div className="voice-toggle">
            <label>
              <input
                type="checkbox"
                checked={voiceOn}
                onChange={() => setVoiceOn(!voiceOn)}
              />
              Voice narration
            </label>
          </div>

          <div className="level-grid">
            {Object.entries(levelInfo).map(([key, item]) => (
              <button
                key={key}
                className={`level-card ${item.theme}`}
                onClick={() => chooseLevel(key)}
                style={{ backgroundImage: `url(${item.bg})` }}
              >
                <div className="overlay"></div>

                <div className="card-content">
                  <div className="level-mascot">{item.mascot}</div>
                  <h2>{item.title}</h2>
                  <p>{item.subtitle}</p>
                  <small className="question-count">
                    {questions.filter((question) => question.level === key).length} questions
                  </small>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (finished) {
    return (
      <main
        className="app game-screen"
        style={{ backgroundImage: `url(${levelInfo[selectedLevel].bg})` }}
      >
        <div className="screen-overlay"></div>

        <div className="animated-particles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <section className="quiz-card result-card">
          <div className="badge">Quiz Complete</div>

          <div className="quiz-mascot">{levelInfo[selectedLevel].mascot}</div>

          <h1>Great Work!</h1>

          <p>
            Your score is <strong>{score}</strong> out of{" "}
            <strong>{filteredQuestions.length}</strong>.
          </p>

          <div className="result-score">
            {score === filteredQuestions.length ? "🏆" : "⭐"}
          </div>

          <button className="primary-btn" onClick={restart}>
            Back to Home
          </button>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="app home-screen">
        <section className="hero">
          <div className="badge">No Questions</div>
          <h1>Hexa Quiz</h1>
          <p>No questions found for this level.</p>
          <button className="primary-btn" onClick={restart}>
            Back to Home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      className="app game-screen"
      style={{ backgroundImage: `url(${levelInfo[selectedLevel].bg})` }}
    >
      <div className="screen-overlay"></div>

      <div className="animated-particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <section className="top-bar">
        <button className="ghost-btn" onClick={restart}>
          ← Home
        </button>

        <button className="ghost-btn" onClick={replayVoice}>
          🔊 Replay Voice
        </button>

        <div className="score-box">
          Score: <strong>{score}</strong>
        </div>
      </section>

      <section className="quiz-card">
        <div className="quiz-header">
          <span className="badge">
            {levelInfo[selectedLevel].title} | Question {questionIndex + 1} of{" "}
            {filteredQuestions.length}
          </span>

          <span className="topic">{formatTopic(currentQuestion.topic)}</span>
        </div>

        <div className="quiz-mascot">{levelInfo[selectedLevel].mascot}</div>

        <p className="story">{currentQuestion.story}</p>

        <div className="difficulty">
          Difficulty: <strong>{currentQuestion.difficulty}</strong>
        </div>

        <h2>{currentQuestion.question}</h2>

        <div className="answers">
          {currentQuestion.options.map((option, index) => {
            let className = "answer-btn";

            if (selectedAnswer !== null) {
              if (index === currentQuestion.correct) {
                className += " correct";
              } else if (index === selectedAnswer) {
                className += " wrong";
              }
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => answerQuestion(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="feedback">
            <h3>
              {selectedAnswer === currentQuestion.correct
                ? "✅ Correct!"
                : "❌ Not quite!"}
            </h3>

            <p>{currentQuestion.explanation}</p>

            <button className="primary-btn" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;