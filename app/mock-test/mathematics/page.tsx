'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  generateMathMockExamByNumber,
  type MathMockExam,
  type MathQuestion,
  type OptionId,
} from '@/lib/mathQuestionGenerator';

const OPTION_KEYS: OptionId[] = ['A', 'B', 'C', 'D'];

type AnswerStatus = 'correct' | 'wrong';

export default function MathematicsMockTest() {
  const [exam, setExam] = useState<MathMockExam | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<number, OptionId>>({});

  const [answerStatus, setAnswerStatus] = useState<
    Record<number, AnswerStatus>
  >({});

  const [timeLeft, setTimeLeft] = useState(50 * 60);

  const [isFinished, setIsFinished] = useState(false);

  const [examNumber, setExamNumber] = useState<number>(1);

  /* =========================================================
     GENERATE EXAM
  ========================================================= */

  useEffect(() => {
    const savedExamNumber = localStorage.getItem('csca-math-exam-number');

    const number = savedExamNumber
      ? Number(savedExamNumber)
      : Math.floor(Math.random() * 1000000) + 1;

    setExamNumber(number);

    const generatedExam = generateMathMockExamByNumber(number);

    setExam(generatedExam);

    setTimeLeft(generatedExam.minutes * 60);
  }, []);

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (!exam || isFinished) {
      return;
    }

    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          window.clearInterval(timer);

          setIsFinished(true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [exam, isFinished, timeLeft]);

  /* =========================================================
     CURRENT QUESTION
  ========================================================= */

  const currentQuestion: MathQuestion | null = useMemo(() => {
    if (!exam) {
      return null;
    }

    return exam.questions[currentIndex] ?? null;
  }, [exam, currentIndex]);

  /* =========================================================
     TIMER FORMAT
  ========================================================= */

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  }, [timeLeft]);

  /* =========================================================
     CURRENT ANSWER
  ========================================================= */

  const selectedAnswer = answers[currentIndex];

  const currentAnswerStatus = answerStatus[currentIndex];

  /* =========================================================
     ANSWER HANDLER
     
     IMPORTANT:
     Once answered, question is LOCKED.
     Explanation automatically appears.
  ========================================================= */

  const handleAnswer = (option: OptionId) => {
    if (isFinished) {
      return;
    }

    // Prevent changing answer
    if (answers[currentIndex] !== undefined) {
      return;
    }

    const correct = option === currentQuestion?.correctOption;

    setAnswers(previous => ({
      ...previous,
      [currentIndex]: option,
    }));

    setAnswerStatus(previous => ({
      ...previous,
      [currentIndex]: correct ? 'correct' : 'wrong',
    }));
  };

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrevious = () => {
    if (currentIndex <= 0) {
      return;
    }

    setCurrentIndex(previous => previous - 1);
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    if (!exam) {
      return;
    }

    if (currentIndex >= exam.questions.length - 1) {
      return;
    }

    setCurrentIndex(previous => previous + 1);
  };

  /* =========================================================
     FINISH
  ========================================================= */

  const handleFinish = () => {
    setIsFinished(true);
  };

  /* =========================================================
     NEW EXAM
  ========================================================= */

  const handleNewExam = () => {
    const newExamNumber = Math.floor(Math.random() * 100000000) + 1;

    localStorage.setItem('csca-math-exam-number', String(newExamNumber));

    const newExam = generateMathMockExamByNumber(newExamNumber);

    setExamNumber(newExamNumber);

    setExam(newExam);

    setCurrentIndex(0);

    setAnswers({});

    setAnswerStatus({});

    setTimeLeft(newExam.minutes * 60);

    setIsFinished(false);
  };

  /* =========================================================
     RESULT
  ========================================================= */

  const result = useMemo(() => {
    if (!exam) {
      return {
        correct: 0,
        wrong: 0,
        unanswered: 0,
        percentage: 0,
      };
    }

    let correct = 0;

    let wrong = 0;

    exam.questions.forEach((question, index) => {
      const selectedAnswer = answers[index];

      if (!selectedAnswer) {
        return;
      }

      if (selectedAnswer === question.correctOption) {
        correct++;
      } else {
        wrong++;
      }
    });

    const unanswered = exam.questions.length - correct - wrong;

    const percentage =
      exam.questions.length > 0
        ? Math.round((correct / exam.questions.length) * 100)
        : 0;

    return {
      correct,
      wrong,
      unanswered,
      percentage,
    };
  }, [exam, answers]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (!exam || !currentQuestion) {
    return (
      <main className="mock-test-page">
        <section className="mock-test-loading">
          <div className="loading-spinner" />

          <h2>Preparing Mathematics Mock Test...</h2>

          <p>Please wait.</p>
        </section>
      </main>
    );
  }

  /* =========================================================
     RESULT SCREEN
  ========================================================= */

  if (isFinished) {
    return (
      <main className="mock-test-page">
        <section className="result-card">
          <div className="result-header">
            <span className="result-badge">TEST COMPLETED</span>

            <h1>Mathematics Mock Test</h1>

            <p>Exam #{examNumber}</p>
          </div>

          <div className="result-score">
            <strong>{result.percentage}%</strong>

            <span>Score</span>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <strong>{result.correct}</strong>

              <span>Correct</span>
            </div>

            <div className="result-stat">
              <strong>{result.wrong}</strong>

              <span>Wrong</span>
            </div>

            <div className="result-stat">
              <strong>{result.unanswered}</strong>

              <span>Unanswered</span>
            </div>

            <div className="result-stat">
              <strong>{exam.questions.length}</strong>

              <span>Total</span>
            </div>
          </div>

          <div className="result-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleNewExam}
            >
              Start New Mock Test
            </button>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     PROGRESS
  ========================================================= */

  const answeredCount = Object.keys(answers).length;

  const progress = ((currentIndex + 1) / exam.questions.length) * 100;

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="mock-test-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="mock-test-header">
        <div className="mock-test-title">
          <span className="subject-label">CSCA MATHEMATICS</span>

          <h1>Mathematics Mock Test</h1>

          <p>
            Question {currentIndex + 1} of {exam.questions.length}
          </p>
        </div>

        <div className="mock-test-info">
          <div className="exam-number">
            <span>Exam</span>

            <strong>#{examNumber}</strong>
          </div>

          <div className={`timer ${timeLeft <= 300 ? 'timer-warning' : ''}`}>
            <span>Time Left</span>

            <strong>{formattedTime}</strong>
          </div>
        </div>
      </header>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="progress-wrapper">
        <div className="progress-info">
          <span>
            Question {currentIndex + 1} / {exam.questions.length}
          </span>

          <span>{answeredCount} answered</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="mock-test-content">
        {/* ===================================================
            QUESTION CARD
        =================================================== */}

        <div className="question-card">
          <div className="question-top">
            <span className="question-number">Question {currentIndex + 1}</span>

            <span className="question-topic">{currentQuestion.topic}</span>
          </div>

          {/* QUESTION */}

          <div className="question-text">{currentQuestion.question}</div>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="question-options">
            {OPTION_KEYS.map(key => {
              const optionText = currentQuestion.options[key];

              const isSelected = selectedAnswer === key;

              /*
               * After answer:
               *
               * Correct option = GREEN
               *
               * Selected wrong option = RED
               */

              const isCorrectOption =
                selectedAnswer !== undefined &&
                currentQuestion.correctOption === key;

              const isWrongSelected =
                selectedAnswer !== undefined &&
                isSelected &&
                currentQuestion.correctOption !== key;

              return (
                <button
                  key={key}
                  type="button"
                  className={[
                    'option-button',

                    isSelected ? 'selected' : '',

                    isCorrectOption ? 'correct' : '',

                    isWrongSelected ? 'wrong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleAnswer(key)}
                  disabled={selectedAnswer !== undefined}
                >
                  <span className="option-letter">{key}</span>

                  <span className="option-text">{optionText}</span>

                  {isCorrectOption && <span className="option-status">✓</span>}

                  {isWrongSelected && <span className="option-status">✕</span>}
                </button>
              );
            })}
          </div>

          {/* =================================================
              AUTOMATIC ANSWER RESULT
          ================================================= */}

          {selectedAnswer && (
            <div
              className={`answer-feedback ${
                currentAnswerStatus === 'correct'
                  ? 'feedback-correct'
                  : 'feedback-wrong'
              }`}
            >
              {currentAnswerStatus === 'correct' ? (
                <>
                  <strong>✓ Correct Answer</strong>

                  <span>You selected the correct option.</span>
                </>
              ) : (
                <>
                  <strong>✕ Incorrect Answer</strong>

                  <span>
                    The correct answer is <b>{currentQuestion.correctOption}</b>
                    .
                  </span>
                </>
              )}
            </div>
          )}

          {/* =================================================
              AUTOMATIC EXPLANATION
          ================================================= */}

          {selectedAnswer && (
            <div className="explanation-box">
              <div className="explanation-header">
                <span>Explanation</span>
              </div>

              <div className="explanation-content">
                <div>
                  <strong>English:</strong>

                  <p>{currentQuestion.explanation.en}</p>
                </div>

                <div>
                  <strong>বাংলা:</strong>

                  <p>{currentQuestion.explanation.bn}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="question-navigation">
          <button
            type="button"
            className="secondary-button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>

          {currentIndex === exam.questions.length - 1 ? (
            <button
              type="button"
              className="finish-button"
              onClick={handleFinish}
            >
              Finish Test
            </button>
          ) : (
            <button
              type="button"
              className="primary-button"
              onClick={handleNext}
            >
              Next →
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
          QUESTION NAVIGATOR
      ===================================================== */}

      <section className="question-navigator">
        <div className="navigator-header">
          <div>
            <h2>Questions</h2>

            <p>Green = Correct · Red = Wrong</p>
          </div>

          <span>
            {answeredCount}/{exam.questions.length} answered
          </span>
        </div>

        <div className="question-grid">
          {exam.questions.map((question, index) => {
            const status = answerStatus[index];

            const isCurrent = index === currentIndex;

            return (
              <button
                key={`${index}-${question.id}`}
                type="button"
                className={[
                  'question-number-button',

                  isCurrent ? 'active' : '',

                  status === 'correct' ? 'navigator-correct' : '',

                  status === 'wrong' ? 'navigator-wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
