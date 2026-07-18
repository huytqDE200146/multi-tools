import React, { useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Card } from 'react-bootstrap';
import { fetchQuestionsByLesson } from '../../features/questions/questionsSlice';
import { toggleOption, submitAnswer } from '../../features/quiz/quizSlice';
import './LessonDetail.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const emptyAnswer = { selected: [], submitted: false, isCorrect: false };

const LessonDetail = () => {
  const { subjectId, lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);
  const answersForLesson = useSelector((state) => state.quiz.answers[lessonId] || {});

  const currentIndex = Math.max(0, parseInt(searchParams.get('q') || '0', 10));
  const currentQuestion = questions[currentIndex];
  const answer = currentQuestion
    ? answersForLesson[currentQuestion.id] || emptyAnswer
    : emptyAnswer;

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  const goToQuestion = useCallback(
    (index) => {
      const clamped = Math.min(Math.max(index, 0), questions.length - 1);
      setSearchParams({ q: String(clamped) });
    },
    [questions.length, setSearchParams]
  );

  const handleSelectOption = useCallback(
    (optionIndex) => {
      if (!currentQuestion) return;
      dispatch(
        toggleOption({
          lessonId,
          questionId: currentQuestion.id,
          optionIndex,
          allowMultiple: currentQuestion.allowMultiple,
        })
      );
    },
    [dispatch, lessonId, currentQuestion]
  );

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || answer.selected.length === 0) return;
    dispatch(
      submitAnswer({
        lessonId,
        questionId: currentQuestion.id,
        correctIndexes: currentQuestion.correctIndexes,
      })
    );
  }, [dispatch, lessonId, currentQuestion, answer.selected.length]);

  // --- Bàn phím: A-F chọn đáp án, Enter submit/next, ← → chuyển câu ---
  useEffect(() => {
    function handleKeyDown(e) {
      if (!currentQuestion) return;

      const letterIndex = OPTION_LETTERS.indexOf(e.key.toUpperCase());
        const numberIndex = '123456'.indexOf(e.key) !== -1 ? Number(e.key) - 1 : -1;
        const optionIndex = letterIndex !== -1 ? letterIndex : numberIndex;

        if (optionIndex !== -1 && optionIndex < currentQuestion.options.length) {
        handleSelectOption(optionIndex);
        return;
        }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!answer.submitted) {
          handleSubmit();
        } else {
          goToQuestion(currentIndex + 1);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        goToQuestion(currentIndex + 1);
        return;
      }

      if (e.key === 'ArrowLeft') {
        goToQuestion(currentIndex - 1);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, answer, currentIndex, handleSelectOption, handleSubmit, goToQuestion]);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" size="sm" />
        <span>Đang tải câu hỏi...</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (questions.length === 0) {
    return (
      <div>
        <Link to={`/lessons/${subjectId}`} className="d-inline-block mb-3">
          ← Quay lại bài học
        </Link>
        <Alert variant="info">Bài học này chưa có câu hỏi nào.</Alert>
      </div>
    );
  }

  const answeredCount = Object.values(answersForLesson).filter((a) => a.submitted).length;

  // Xác định trạng thái màu cho từng lựa chọn sau khi đã submit
  const getOptionState = (optionIndex) => {
    if (!answer.submitted) {
      return answer.selected.includes(optionIndex) ? 'selected' : 'default';
    }
    const isCorrectOption = currentQuestion.correctIndexes.includes(optionIndex);
    const wasSelected = answer.selected.includes(optionIndex);

    if (isCorrectOption && wasSelected) return 'correct';
    if (isCorrectOption && !wasSelected) return 'missed';
    if (!isCorrectOption && wasSelected) return 'wrong';
    return 'default';
  };

  return (
    <div className="lesson-detail-dark">
      <Link to={`/lessons/${subjectId}`} className="d-inline-block mb-3 lesson-back-link">
        ← Quay lại danh sách bài học
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">
          Câu {currentIndex + 1} / {questions.length}
          {currentQuestion.allowMultiple && (
            <span className="lesson-multi-badge">Chọn nhiều đáp án</span>
          )}
        </h1>
        <Link to={`/lessons/${subjectId}/${lessonId}/review`} className="lesson-review-link">
          Xem tất cả câu hỏi ({answeredCount}/{questions.length} đã làm)
        </Link>
      </div>

      <Card className="mb-3 lesson-question-card">
        <Card.Body>
          <Card.Title className="lesson-question-text">{currentQuestion.questionText}</Card.Title>
          <div className="mt-3">
            {currentQuestion.options.map((option, idx) => {
              const optionState = getOptionState(idx);
              return (
                <button
                  key={idx}
                  className={`lesson-option-btn lesson-option-${optionState}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answer.submitted}
                >
                  <span className="lesson-option-letter">{OPTION_LETTERS[idx]}</span>
                  {option}
                </button>
              );
            })}
          </div>

          {answer.submitted && (
            <div className={`lesson-result-banner ${answer.isCorrect ? 'correct' : 'wrong'}`}>
              {answer.isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng.'}
              {currentQuestion.explanation && (
                <div className="lesson-explanation">{currentQuestion.explanation}</div>
              )}
            </div>
          )}

          {!answer.submitted && (
            <button
              className="lesson-submit-btn"
              onClick={handleSubmit}
              disabled={answer.selected.length === 0}
            >
              Nộp câu trả lời (Enter)
            </button>
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <button
          className="lesson-nav-btn"
          disabled={currentIndex === 0}
          onClick={() => goToQuestion(currentIndex - 1)}
        >
          ← Câu trước
        </button>
        <button
          className="lesson-nav-btn"
          disabled={currentIndex === questions.length - 1}
          onClick={() => goToQuestion(currentIndex + 1)}
        >
          Câu tiếp →
        </button>
      </div>
    </div>
  );
};

export default LessonDetail;