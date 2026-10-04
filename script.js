/**
 * ============================================================================
 * DevQuiz - Professional Frontend Internship Quiz Application
 * Pure Vanilla JavaScript (ES6+) - Zero external libraries or frameworks
 * ============================================================================
 */

"use strict";

/* ==========================================================================
   1. QUIZ DATA REPOSITORY
   ========================================================================== */
/**
 * 10 High-Quality Frontend & Web Development Questions.
 * Structured with text, options array, and single correct answer index (0-3).
 */
const quizQuestions = [
  {
    id: 1,
    category: "HTML5",
    question: "Which HTML5 semantic element is specifically intended to define a footer for a document or section?",
    options: [
      "<footer>",
      "<bottom>",
      "<section-footer>",
      "<aside>"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    category: "CSS3",
    question: "Which CSS property causes an element's padding and border to be included within its specified width and height?",
    options: [
      "box-model: border-box",
      "box-sizing: border-box",
      "content-sizing: contain",
      "border-collapse: separate"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    category: "JavaScript",
    question: "Which primitive data type was introduced in ECMAScript 2020 to safely represent integers larger than 2^53 - 1?",
    options: [
      "LongInt",
      "Decimal",
      "BigInt",
      "Int64"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    category: "CSS3",
    question: "Which CSS media feature query is used to detect if the user has requested a system dark color theme?",
    options: [
      "color-mode: dark",
      "device-theme: dark",
      "system-appearance: dark",
      "prefers-color-scheme: dark"
    ],
    correctAnswer: 3
  },
  {
    id: 5,
    category: "Web APIs",
    question: "Which standard Web API method returns a Promise that resolves with a Response object representing the response to a network request?",
    options: [
      "XMLHttpRequest()",
      "fetch()",
      "axios()",
      "request()"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    category: "JavaScript",
    question: "Which DOM method returns the very first Element within the document that matches the specified CSS selector group?",
    options: [
      "document.querySelector()",
      "document.getElementsByClassName()",
      "document.findById()",
      "document.element()"
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    category: "Performance",
    question: "Which native HTML attribute enables the browser to defer off-screen image loading until the user scrolls near them?",
    options: [
      "defer=\"true\"",
      "async=\"true\"",
      "loading=\"lazy\"",
      "prefetch=\"offscreen\""
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    category: "JavaScript",
    question: "In the JavaScript Event Loop, which queue receives callbacks from resolved Promises and MutationObserver?",
    options: [
      "Macrotask Queue",
      "Microtask Queue",
      "Animation Frame Queue",
      "Direct Execution Stack"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    category: "Accessibility",
    question: "In modern web accessibility standards, what does the W3C acronym 'ARIA' stand for?",
    options: [
      "Accessible Rich Internet Applications",
      "Advanced Responsive Interface Assets",
      "Automated Reader Integration Architecture",
      "Application Realtime Interface Access"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    category: "Version Control",
    question: "Which Git command is used to permanently record staged snapshot changes into the repository history?",
    options: [
      "git push",
      "git stage",
      "git checkout",
      "git commit"
    ],
    correctAnswer: 3
  }
];

/* ==========================================================================
   2. APPLICATION STATE MANAGEMENT
   ========================================================================== */
let currentQuestionIndex = 0;
let userScore = 0;
let selectedAnswerIndex = null;
let isAnswerSubmitted = false;

/* ==========================================================================
   3. DOM ELEMENT REFERENCES
   ========================================================================== */
// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Controls
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const nextBtnText = document.getElementById("next-btn-text");
const restartBtn = document.getElementById("restart-btn");

// Quiz Progress & Content
const questionCategory = document.getElementById("question-category");
const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const progressBarTrack = document.getElementById("progress-bar-track");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const validationMessage = document.getElementById("validation-message");

// Result Elements
const finalScoreFraction = document.getElementById("final-score-fraction");
const scoreSummary = document.getElementById("score-summary");
const performanceBadge = document.getElementById("performance-badge");
const performanceText = document.getElementById("performance-text");
const statTotal = document.getElementById("stat-total");
const statCorrect = document.getElementById("stat-correct");
const statIncorrect = document.getElementById("stat-incorrect");
const statAccuracy = document.getElementById("stat-accuracy");

/* ==========================================================================
   4. CORE QUIZ FUNCTIONS
   ========================================================================== */

/**
 * Initializes the application and binds event listeners.
 */
function initializeApp() {
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", handleNextAction);
  restartBtn.addEventListener("click", restartQuiz);

  // Keyboard accessibility: 1, 2, 3, 4 keys to select options
  document.addEventListener("keydown", handleKeyboardSelection);
}

/**
 * Starts the quiz by switching to the quiz screen and rendering Question 1.
 */
function startQuiz() {
  currentQuestionIndex = 0;
  userScore = 0;
  selectedAnswerIndex = null;
  isAnswerSubmitted = false;

  // Switch screens
  switchScreen(startScreen, quizScreen);

  // Render first question
  renderCurrentQuestion();
}

/**
 * Renders the question corresponding to currentQuestionIndex.
 */
function renderCurrentQuestion() {
  const currentQ = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  const questionNumber = currentQuestionIndex + 1;

  // Reset question state
  selectedAnswerIndex = null;
  isAnswerSubmitted = false;
  hideValidationMessage();

  // Update Category Badge
  questionCategory.textContent = currentQ.category;

  // Update Question Counter (e.g., "Question 2 of 10")
  questionCounter.textContent = `Question ${questionNumber} of ${totalQuestions}`;

  // Update Visual Progress Bar
  updateProgressBar(questionNumber, totalQuestions);

  // Set Question Text
  questionText.textContent = currentQ.question;

  // Update Button Label: "Next Question" or "Submit Quiz" on final question
  if (questionNumber === totalQuestions) {
    nextBtnText.textContent = "Submit Quiz";
  } else {
    nextBtnText.textContent = "Next Question";
  }

  // Clear previous options
  optionsContainer.innerHTML = "";

  // Render 4 Answer Options
  const optionLetters = ["A", "B", "C", "D"];
  currentQ.options.forEach((optionText, index) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.className = "option-btn";
    optionButton.setAttribute("role", "radio");
    optionButton.setAttribute("aria-checked", "false");
    optionButton.dataset.index = index;

    // Inner content with badge letter and radio indicator
    optionButton.innerHTML = `
      <span class="option-badge" aria-hidden="true">${optionLetters[index]}</span>
      <span class="option-label">${escapeHtml(optionText)}</span>
      <span class="option-indicator" aria-hidden="true"></span>
    `;

    // Click handler for selection
    optionButton.addEventListener("click", () => handleOptionSelection(index));

    optionsContainer.appendChild(optionButton);
  });
}

/**
 * Handles user selection of an answer option.
 * Highlights the chosen option, locks choices, and updates state.
 * @param {number} chosenIndex - The index of the selected option (0-3).
 */
function handleOptionSelection(chosenIndex) {
  // Prevent re-selection if answer is already locked
  if (isAnswerSubmitted) {
    return;
  }

  selectedAnswerIndex = chosenIndex;
  isAnswerSubmitted = true;
  hideValidationMessage();

  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, idx) => {
    // Disable all options to prevent subsequent changes or multiple clicks
    btn.disabled = true;

    if (idx === chosenIndex) {
      btn.classList.add("selected");
      btn.setAttribute("aria-checked", "true");
    } else {
      btn.classList.remove("selected");
      btn.setAttribute("aria-checked", "false");
    }
  });
}

/**
 * Handles the "Next Question" or "Submit Quiz" button click.
 * Validates that an option has been selected before advancing.
 */
function handleNextAction() {
  // Validation: User must select an answer before proceeding
  if (selectedAnswerIndex === null) {
    showValidationMessage("Please select an answer before continuing.");
    return;
  }

  // Score checking: compare selected option with correct answer
  const currentQ = quizQuestions[currentQuestionIndex];
  if (selectedAnswerIndex === currentQ.correctAnswer) {
    userScore += 1;
  }

  // Check if we are on the final question
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  if (isLastQuestion) {
    displayResults();
  } else {
    // Advance to next question
    currentQuestionIndex += 1;
    renderCurrentQuestion();
  }
}

/**
 * Updates the visual progress bar width and ARIA values.
 * @param {number} current - Current question number (1-based).
 * @param {number} total - Total question count.
 */
function updateProgressBar(current, total) {
  const percentage = Math.round((current / total) * 100);
  progressBar.style.width = `${percentage}%`;
  progressBarTrack.setAttribute("aria-valuenow", percentage);
}

/**
 * Displays the final results screen with score, statistics, and customized rating.
 */
function displayResults() {
  const totalQuestions = quizQuestions.length;
  const correctCount = userScore;
  const incorrectCount = totalQuestions - userScore;
  const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

  // Switch to result screen
  switchScreen(quizScreen, resultScreen);

  // Populate Score Details
  finalScoreFraction.textContent = `${correctCount} / ${totalQuestions}`;
  scoreSummary.textContent = `You answered ${correctCount} out of ${totalQuestions} questions correctly.`;

  // Populate Metric Cards
  statTotal.textContent = totalQuestions;
  statCorrect.textContent = correctCount;
  statIncorrect.textContent = incorrectCount;
  statAccuracy.textContent = `${accuracyPercentage}%`;

  // Performance Rating Logic
  applyPerformanceFeedback(correctCount, totalQuestions);
}

/**
 * Determines and renders the performance badge and custom message based on score.
 * @param {number} score - Total correct answers.
 * @param {number} total - Total questions.
 */
function applyPerformanceFeedback(score, total) {
  const percentage = (score / total) * 100;
  performanceBadge.className = "performance-pill";

  if (percentage >= 90) {
    performanceBadge.textContent = "Excellent";
    performanceBadge.classList.add("perf-excellent");
    performanceText.textContent = "Outstanding mastery! You have a profound understanding of modern frontend technologies.";
  } else if (percentage >= 70) {
    performanceBadge.textContent = "Great job";
    performanceBadge.classList.add("perf-great");
    performanceText.textContent = "Strong foundation! You demonstrated impressive knowledge across core web concepts.";
  } else if (percentage >= 50) {
    performanceBadge.textContent = "Good effort";
    performanceBadge.classList.add("perf-good");
    performanceText.textContent = "Solid start! A bit more practice on modern standards will make your skills rock solid.";
  } else {
    performanceBadge.textContent = "Keep practicing";
    performanceBadge.classList.add("perf-practice");
    performanceText.textContent = "Keep coding and exploring! Review frontend fundamentals and give it another shot.";
  }
}

/**
 * Restarts the quiz completely from Question 1, resetting all scores and UI states.
 */
function restartQuiz() {
  currentQuestionIndex = 0;
  userScore = 0;
  selectedAnswerIndex = null;
  isAnswerSubmitted = false;

  // Switch from result screen back to active quiz screen
  switchScreen(resultScreen, quizScreen);

  // Render question 1 fresh
  renderCurrentQuestion();
}

/**
 * Helper function to smoothly transition between screens.
 * @param {HTMLElement} fromScreen - Screen to hide.
 * @param {HTMLElement} toScreen - Screen to show.
 */
function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.remove("active");
  fromScreen.hidden = true;

  toScreen.hidden = false;
  // Trigger layout reflow for animation
  void toScreen.offsetWidth;
  toScreen.classList.add("active");
}

/**
 * Displays the friendly validation alert message.
 * @param {string} msg - Message text to display.
 */
function showValidationMessage(msg) {
  const validationText = document.getElementById("validation-text");
  if (validationText) {
    validationText.textContent = msg;
  }
  validationMessage.hidden = false;

  // Re-trigger animation shake if already visible
  validationMessage.classList.remove("shake");
  void validationMessage.offsetWidth;
  validationMessage.classList.add("shake");
}

/**
 * Hides the validation alert banner.
 */
function hideValidationMessage() {
  validationMessage.hidden = true;
}

/**
 * Keyboard navigation support: Press keys 1-4 to select options.
 * @param {KeyboardEvent} event
 */
function handleKeyboardSelection(event) {
  // Only listen when the quiz screen is currently active
  if (quizScreen.hidden || isAnswerSubmitted) {
    return;
  }

  const keyMap = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3
  };

  if (event.key in keyMap) {
    handleOptionSelection(keyMap[event.key]);
  }
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str - Raw string.
 * @returns {string} - Escaped string.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   5. EXECUTION ENTRY POINT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", initializeApp);
