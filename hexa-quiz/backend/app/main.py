from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv
from pathlib import Path

app = FastAPI(title="Hexa Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTION_FILE = Path(__file__).resolve().parent.parent / "data" / "questions.csv"


@app.get("/")
def home():
    return {
        "message": "Welcome to Hexa Quiz API",
        "description": "Cyber-security quiz game API",
        "endpoints": [
            "/questions",
            "/questions/kids",
            "/questions/teens",
            "/questions/adults"
        ]
    }


@app.get("/questions")
def get_all_questions():
    return load_questions()


@app.get("/questions/{level}")
def get_questions_by_level(level: str):
    questions = load_questions()
    filtered_questions = []

    for question in questions:
        if question["level"].lower() == level.lower():
            filtered_questions.append(question)

    return filtered_questions


def load_questions():
    if not QUESTION_FILE.exists():
        return []

    with open(QUESTION_FILE, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        return list(reader)