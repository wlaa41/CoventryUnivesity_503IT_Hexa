/* ============================================================
   HEXA CYBER QUIZ — Game Logic
   ============================================================ */

const QUESTIONS_PER_GAME = 10;
const CSV_PATH = 'content/FINAL-~1.CSV';

// ---------- State ----------
let allQuestions   = [];
let gameQuestions  = [];
let currentIndex   = 0;
let score          = 0;
let currentGroup   = '';

// ---------- DOM refs ----------
const screens = {
    home:     document.getElementById('screen-home'),
    quiz:     document.getElementById('screen-quiz'),
    feedback: document.getElementById('screen-feedback'),
    end:      document.getElementById('screen-end'),
};
const loading       = document.getElementById('loading');
const progressFill  = document.getElementById('progress-fill');
const qCounter      = document.getElementById('q-counter');
const liveScore     = document.getElementById('live-score');
const topicBadge    = document.getElementById('topic-badge');
const diffBadge     = document.getElementById('diff-badge');
const storyText     = document.getElementById('story-text');
const questionText  = document.getElementById('question-text');
const optTexts      = {
    A: document.getElementById('opt-a'),
    B: document.getElementById('opt-b'),
    C: document.getElementById('opt-c'),
    D: document.getElementById('opt-d'),
};
const optBtns       = document.querySelectorAll('.opt-btn');
const fbIcon        = document.getElementById('fb-icon');
const fbTitle       = document.getElementById('fb-title');
const fbExplanation = document.getElementById('fb-explanation');
const btnNext       = document.getElementById('btn-next');
const endScore      = document.getElementById('end-score');
const endMessage    = document.getElementById('end-message');
const endStars      = document.getElementById('end-stars');

// ---------- Screen management ----------
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- CSV Parser ----------
// Handles quoted fields containing commas and apostrophes.
function parseCSV(raw) {
    const rows = splitIntoLines(raw);
    if (rows.length < 2) return [];

    const headers = parseLine(rows[0]).map(h => h.trim());

    return rows.slice(1)
        .filter(r => r.trim().length > 0)
        .map(row => {
            const vals = parseLine(row);
            const obj = {};
            headers.forEach((h, i) => {
                obj[h] = (vals[i] ?? '').trim().replace(/^"|"$/g, '');
            });
            return obj;
        })
        .filter(q => q.is_active === 'true');
}

function splitIntoLines(text) {
    const lines = [];
    let cur = '';
    let inQ  = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') { inQ = !inQ; cur += ch; continue; }
        if (!inQ && (ch === '\n' || ch === '\r')) {
            if (cur.trim()) lines.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    if (cur.trim()) lines.push(cur);
    return lines;
}

function parseLine(line) {
    const result = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
        else { cur += ch; }
    }
    result.push(cur);
    return result;
}

// ---------- Shuffle (Fisher-Yates) ----------
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ---------- Load questions from CSV ----------
async function loadQuestions() {
    loading.classList.remove('hidden');
    try {
        const res = await fetch(CSV_PATH);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        allQuestions = parseCSV(text);
        console.log(`[Hexa Quiz] Loaded ${allQuestions.length} questions.`);
    } catch (err) {
        loading.innerHTML = `
            <p style="color:#f87171;text-align:center;padding:20px;max-width:400px">
                ⚠️ Could not load questions.<br><br>
                Make sure you are running the game from a local server<br>
                (not by double-clicking the file).
            </p>`;
        console.error('[Hexa Quiz] Failed to load CSV:', err);
        return;
    }
    loading.classList.add('hidden');
    bindAgeCards();
}

// ---------- Age card click ----------
function bindAgeCards() {
    document.querySelectorAll('.age-card').forEach(card => {
        card.addEventListener('click', () => startGame(card.dataset.group));
    });
}

// ---------- Start game ----------
function startGame(group) {
    currentGroup = group;
    const pool = allQuestions.filter(q => q.age_group === group);
    gameQuestions = shuffle(pool).slice(0, Math.min(QUESTIONS_PER_GAME, pool.length));
    currentIndex  = 0;
    score         = 0;
    liveScore.textContent = '0';
    renderQuestion();
    showScreen('quiz');
}

// ---------- Render question ----------
function renderQuestion() {
    const q     = gameQuestions[currentIndex];
    const total = gameQuestions.length;

    // Header
    qCounter.textContent     = `${currentIndex + 1} / ${total}`;
    progressFill.style.width = `${(currentIndex / total) * 100}%`;

    // Badges
    topicBadge.textContent  = q.topic.replace(/_/g, ' ');
    topicBadge.className    = `badge ${q.topic}`;
    diffBadge.textContent   = q.difficulty;
    diffBadge.className     = `badge ${q.difficulty}`;

    // Story & question
    storyText.textContent    = q.story;
    questionText.textContent = q.question;

    // Options
    optTexts.A.textContent = q.option_a;
    optTexts.B.textContent = q.option_b;
    optTexts.C.textContent = q.option_c;
    optTexts.D.textContent = q.option_d;

    // Reset buttons
    optBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong', 'reveal');
    });
}

// ---------- Handle answer ----------
function handleAnswer(chosen) {
    const q       = gameQuestions[currentIndex];
    const correct = q.correct_option.trim().toUpperCase();
    const isRight = chosen === correct;

    if (isRight) {
        score++;
        liveScore.textContent = score;
    }

    // Disable all & colour feedback on the grid
    optBtns.forEach(btn => {
        btn.disabled = true;
        const opt = btn.dataset.opt;
        if (opt === correct) {
            btn.classList.add(isRight && opt === chosen ? 'correct' : 'reveal');
        } else if (opt === chosen && !isRight) {
            btn.classList.add('wrong');
        }
    });

    setTimeout(() => showFeedback(isRight, q.explanation), 650);
}

// ---------- Feedback screen ----------
function showFeedback(isRight, explanation) {
    fbIcon.textContent      = isRight ? '✅' : '❌';
    fbTitle.textContent     = isRight ? 'Correct!' : 'Not quite!';
    fbTitle.className       = `fb-title ${isRight ? 'correct' : 'wrong'}`;
    fbExplanation.textContent = explanation;

    const isLast = currentIndex >= gameQuestions.length - 1;
    btnNext.textContent = isLast ? '🏆 See Results' : 'Next Question →';

    showScreen('feedback');
}

// ---------- End screen ----------
function showEnd() {
    const total = gameQuestions.length;
    endScore.textContent = `${score} / ${total}`;

    const pct = score / total;
    let msg, stars;
    if (pct === 1)     { msg = 'Perfect score! You\'re a cybersecurity expert! 🌟'; stars = '⭐⭐⭐⭐⭐'; }
    else if (pct >= .8){ msg = 'Excellent! You have strong cybersecurity awareness. 👏'; stars = '⭐⭐⭐⭐'; }
    else if (pct >= .6){ msg = 'Good work! Keep learning to stay safe online. 💪'; stars = '⭐⭐⭐'; }
    else if (pct >= .4){ msg = 'Getting there! Explore more cybersecurity topics. 📚'; stars = '⭐⭐'; }
    else               { msg = 'Keep practising — cybersecurity knowledge is vital. 🔐'; stars = '⭐'; }

    endMessage.textContent = msg;
    endStars.textContent   = stars;
    showScreen('end');
}

// ---------- Event listeners ----------
document.getElementById('btn-back').addEventListener('click', () => showScreen('home'));

btnNext.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= gameQuestions.length) {
        showEnd();
    } else {
        renderQuestion();
        showScreen('quiz');
    }
});

document.getElementById('btn-retry').addEventListener('click', () => startGame(currentGroup));
document.getElementById('btn-home').addEventListener('click', () => showScreen('home'));

optBtns.forEach(btn => btn.addEventListener('click', () => handleAnswer(btn.dataset.opt)));

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('hexa-theme', theme);
}

// Load saved theme (default: dark)
const savedTheme = localStorage.getItem('hexa-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Boot ----------
loadQuestions();
