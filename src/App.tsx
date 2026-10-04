/**
 * ============================================================================
 * DevQuiz - Modern Frontend Internship Quiz Application (React + TypeScript)
 * ============================================================================
 */

import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    category: "HTML5",
    question: "Which HTML5 semantic element is specifically intended to define a footer for a document or section?",
    options: ["<footer>", "<bottom>", "<section-footer>", "<aside>"],
    correctAnswer: 0,
  },
  {
    id: 2,
    category: "CSS3",
    question: "Which CSS property causes an element's padding and border to be included within its specified width and height?",
    options: [
      "box-model: border-box",
      "box-sizing: border-box",
      "content-sizing: contain",
      "border-collapse: separate",
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    category: "JavaScript",
    question: "Which primitive data type was introduced in ECMAScript 2020 to safely represent integers larger than 2^53 - 1?",
    options: ["LongInt", "Decimal", "BigInt", "Int64"],
    correctAnswer: 2,
  },
  {
    id: 4,
    category: "CSS3",
    question: "Which CSS media feature query is used to detect if the user has requested a system dark color theme?",
    options: [
      "color-mode: dark",
      "device-theme: dark",
      "system-appearance: dark",
      "prefers-color-scheme: dark",
    ],
    correctAnswer: 3,
  },
  {
    id: 5,
    category: "Web APIs",
    question: "Which standard Web API method returns a Promise that resolves with a Response object representing the response to a network request?",
    options: ["XMLHttpRequest()", "fetch()", "axios()", "request()"],
    correctAnswer: 1,
  },
  {
    id: 6,
    category: "JavaScript",
    question: "Which DOM method returns the very first Element within the document that matches the specified CSS selector group?",
    options: [
      "document.querySelector()",
      "document.getElementsByClassName()",
      "document.findById()",
      "document.element()",
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    category: "Performance",
    question: "Which native HTML attribute enables the browser to defer off-screen image loading until the user scrolls near them?",
    options: [
      'defer="true"',
      'async="true"',
      'loading="lazy"',
      'prefetch="offscreen"',
    ],
    correctAnswer: 2,
  },
  {
    id: 8,
    category: "JavaScript",
    question: "In the JavaScript Event Loop, which queue receives callbacks from resolved Promises and MutationObserver?",
    options: [
      "Macrotask Queue",
      "Microtask Queue",
      "Animation Frame Queue",
      "Direct Execution Stack",
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    category: "Accessibility",
    question: "In modern web accessibility standards, what does the W3C acronym 'ARIA' stand for?",
    options: [
      "Accessible Rich Internet Applications",
      "Advanced Responsive Interface Assets",
      "Automated Reader Integration Architecture",
      "Application Realtime Interface Access",
    ],
    correctAnswer: 0,
  },
  {
    id: 10,
    category: "Version Control",
    question: "Which Git command is used to permanently record staged snapshot changes into the repository history?",
    options: ["git push", "git stage", "git checkout", "git commit"],
    correctAnswer: 3,
  },
];

type ScreenState = "start" | "quiz" | "result";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalQuestions = quizQuestions.length;
  const currentQ = quizQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const isLastQuestion = questionNumber === totalQuestions;
  const progressPercentage = Math.round((questionNumber / totalQuestions) * 100);

  // Keyboard accessibility: 1-4 keys to select options
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (screen !== "quiz" || isAnswerSubmitted) return;
      const keyMap: Record<string, number> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        A: 0,
        B: 1,
        C: 2,
        D: 3,
      };
      if (e.key in keyMap) {
        handleOptionSelect(keyMap[e.key]);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, isAnswerSubmitted, currentQuestionIndex]);

  function startQuiz() {
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setValidationError(null);
    setScreen("quiz");
  }

  function handleOptionSelect(chosenIndex: number) {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(chosenIndex);
    setIsAnswerSubmitted(true);
    setValidationError(null);
  }

  function handleNextAction() {
    if (selectedAnswerIndex === null) {
      setValidationError("Please select an answer before continuing.");
      return;
    }

    const isCorrect = selectedAnswerIndex === currentQ.correctAnswer;
    const nextScore = isCorrect ? userScore + 1 : userScore;
    if (isCorrect) {
      setUserScore(nextScore);
    }

    if (isLastQuestion) {
      setScreen("result");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
      setValidationError(null);
    }
  }

  function restartQuiz() {
    setCurrentQuestionIndex(0);
    setUserScore(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setValidationError(null);
    setScreen("quiz");
  }

  const optionLetters = ["A", "B", "C", "D"];
  const correctCount = userScore;
  const incorrectCount = totalQuestions - userScore;
  const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

  function getPerformanceRating(score: number, total: number) {
    const pct = (score / total) * 100;
    if (pct >= 90) {
      return {
        badge: "Excellent",
        className: "perf-excellent",
        desc: "Outstanding mastery! You have a profound understanding of modern frontend technologies.",
      };
    }
    if (pct >= 70) {
      return {
        badge: "Great job",
        className: "perf-great",
        desc: "Strong foundation! You demonstrated impressive knowledge across core web concepts.",
      };
    }
    if (pct >= 50) {
      return {
        badge: "Good effort",
        className: "perf-good",
        desc: "Solid start! A bit more practice on modern standards will make your skills rock solid.",
      };
    }
    return {
      badge: "Keep practicing",
      className: "perf-practice",
      desc: "Keep coding and exploring! Review frontend fundamentals and give it another shot.",
    };
  }

  const rating = getPerformanceRating(correctCount, totalQuestions);

  return (
    <>
      <div className="ambient-glow glow-top" aria-hidden="true" />
      <div className="ambient-glow glow-bottom" aria-hidden="true" />

      <main className="quiz-wrapper">
        <div className="quiz-card" id="quiz-card">
          {/* ================= 1. START / WELCOME SCREEN ================= */}
          {screen === "start" && (
            <section id="start-screen" className="screen-view" aria-labelledby="start-title">
              <div className="brand-badge">
                <svg
                  className="badge-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Frontend Engineering Assessment</span>
              </div>

              <h1 id="start-title" className="title-primary">
                Web Development Quiz
              </h1>
              <p className="subtitle-text">
                Challenge your knowledge across HTML5, modern CSS3, ES6+ JavaScript, DOM APIs, and core web performance concepts.
              </p>

              <div className="quiz-info-grid">
                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Questions</span>
                    <strong className="info-val">10 Multiple Choice</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Pace</span>
                    <strong className="info-val">Self-Paced</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Evaluation</span>
                    <strong className="info-val">Detailed Feedback</strong>
                  </div>
                </div>
              </div>

              <div className="rules-card">
                <h2 className="rules-heading">Assessment Guidelines</h2>
                <ul className="rules-list">
                  <li>Select exactly one answer per question before proceeding.</li>
                  <li>Once an option is selected, your choice is locked for that question.</li>
                  <li>Receive your comprehensive score report and performance rating upon completion.</li>
                </ul>
              </div>

              <button type="button" id="start-btn" className="btn btn-primary btn-block" onClick={startQuiz}>
                <span>Start Quiz</span>
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </section>
          )}

          {/* ================= 2. ACTIVE QUIZ SCREEN ================= */}
          {screen === "quiz" && (
            <section id="quiz-screen" className="screen-view" aria-labelledby="question-text">
              <header className="quiz-header">
                <span id="question-category" className="category-pill">
                  {currentQ.category}
                </span>
                <span id="question-counter" className="counter-text" aria-live="polite">
                  Question {questionNumber} of {totalQuestions}
                </span>
              </header>

              <div
                className="progress-track"
                role="progressbar"
                id="progress-bar-track"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercentage}
                aria-label="Quiz progress"
              >
                <div id="progress-bar" className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className="question-container">
                <h2 id="question-text" className="question-title">
                  {currentQ.question}
                </h2>

                <div id="options-container" className="options-grid" role="group" aria-label="Answer options">
                  {currentQ.options.map((optionText, idx) => {
                    const isSelected = selectedAnswerIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`option-btn ${isSelected ? "selected" : ""}`}
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleOptionSelect(idx)}
                      >
                        <span className="option-badge" aria-hidden="true">
                          {optionLetters[idx]}
                        </span>
                        <span className="option-label">{optionText}</span>
                        <span className="option-indicator" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {validationError && (
                <div id="validation-message" className="validation-banner" role="alert" aria-live="assertive">
                  <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span id="validation-text">{validationError}</span>
                </div>
              )}

              <footer className="quiz-footer">
                <div className="helper-hint">
                  <span className="hint-dot" aria-hidden="true" />
                  <span>Tap an option to select your answer</span>
                </div>
                <button type="button" id="next-btn" className="btn btn-primary" onClick={handleNextAction}>
                  <span id="next-btn-text">{isLastQuestion ? "Submit Quiz" : "Next Question"}</span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </footer>
            </section>
          )}

          {/* ================= 3. RESULT SCREEN ================= */}
          {screen === "result" && (
            <section id="result-screen" className="screen-view" aria-labelledby="result-title">
              <div className="result-header">
                <div className="result-icon-wrapper" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <h2 id="result-title" className="title-primary">
                  Quiz Completed!
                </h2>
                <p className="subtitle-text">Here is your assessment summary and score evaluation.</p>
              </div>

              <div className="score-display-card">
                <div className="score-circle">
                  <span id="final-score-fraction" className="score-number">
                    {correctCount} / {totalQuestions}
                  </span>
                  <span className="score-label">Final Score</span>
                </div>
                <p id="score-summary" className="score-sentence">
                  You answered {correctCount} out of {totalQuestions} questions correctly.
                </p>
                <div id="performance-badge" className={`performance-pill ${rating.className}`}>
                  {rating.badge}
                </div>
                <p id="performance-text" className="performance-description">
                  {rating.desc}
                </p>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-title">Total Questions</span>
                  <strong id="stat-total" className="metric-value">
                    {totalQuestions}
                  </strong>
                </div>
                <div className="metric-card metric-success">
                  <span className="metric-title">Correct Answers</span>
                  <strong id="stat-correct" className="metric-value">
                    {correctCount}
                  </strong>
                </div>
                <div className="metric-card metric-error">
                  <span className="metric-title">Incorrect</span>
                  <strong id="stat-incorrect" className="metric-value">
                    {incorrectCount}
                  </strong>
                </div>
                <div className="metric-card metric-accent">
                  <span className="metric-title">Accuracy Rate</span>
                  <strong id="stat-accuracy" className="metric-value">
                    {accuracyPercentage}%
                  </strong>
                </div>
              </div>

              <button type="button" id="restart-btn" className="btn btn-primary btn-block" onClick={restartQuiz}>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Restart Quiz</span>
              </button>
            </section>
          )}
        </div>

        <footer className="app-footer">
          <p>Frontend Development Internship Project &bull; Built with React, TypeScript &amp; Modern CSS3</p>
        </footer>
      </main>
    </>
  );
}
