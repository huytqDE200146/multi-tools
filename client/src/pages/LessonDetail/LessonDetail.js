import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Card } from 'react-bootstrap';
import { fetchQuestionsByLesson } from '../../features/questions/questionsSlice';
import { toggleOption, submitAnswer, resetLessonAnswers } from '../../features/quiz/quizSlice';
import './LessonDetail.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const emptyAnswer = { selected: [], submitted: false, isCorrect: false };

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const LessonDetail = () => {
  const { subjectId, lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);
  const answersForLesson = useSelector((state) => state.quiz.answers[lessonId] || {});

  const [mode, setMode] = useState('sequential'); // 'sequential' | 'random'
  const [displayOrder, setDisplayOrder] = useState([]);
  const prevModeRef = useRef(mode);

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  // Tính lại thứ tự hiển thị khi questions tải xong hoặc mode thay đổi.
  // CHỈ reset về câu 0 khi mode thực sự đổi (người dùng bấm nút) - không đè lên
  // tham số ?q= đã có sẵn trên URL (ví dụ khi nhảy tới từ ReviewGrid).
  useEffect(() => {
    if (questions.length === 0) return;
    const baseOrder = questions.map((_, idx) => idx);
    const newOrder = mode === 'random' ? shuffleArray(baseOrder) : baseOrder;
    setDisplayOrder(newOrder);

    if (prevModeRef.current !== mode) {
      setSearchParams({ q: '0' });
    }
    prevModeRef.current = mode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length, mode]);

  const currentPosition = Math.max(0, parseInt(searchParams.get('q') || '0', 10));
  const currentQuestionIndex = displayOrder[currentPosition];
  const currentQuestion =
    currentQuestionIndex !== undefined ? questions[currentQuestionIndex] : undefined;

  const answer = currentQuestion
    ? answersForLesson[currentQuestion.id] || emptyAnswer
    : emptyAnswer;

  const goToPosition = useCallback(
    (position) => {
      const clamped = Math.min(Math.max(position, 0), displayOrder.length - 1);
      setSearchParams({ q: String(clamped) });
    },
    [displayOrder.length, setSearchParams]
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

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      'Xóa toàn bộ đáp án đã làm trong bài này và bắt đầu lại từ đầu?'
    );
    if (!confirmed) return;
    dispatch(resetLessonAnswers(lessonId));
    goToPosition(0);
  }, [dispatch, lessonId, goToPosition]);

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
          goToPosition(currentPosition + 1);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        goToPosition(currentPosition + 1);
        return;
      }

      if (e.key === 'ArrowLeft') {
        goToPosition(currentPosition - 1);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, answer, currentPosition, handleSelectOption, handleSubmit, goToPosition]);

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

  if (!currentQuestion) {
    return null;
  }

  const answeredCount = Object.values(answersForLesson).filter((a) => a.submitted).length;

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

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="lesson-mode-toggle">
          <button
            className={`lesson-mode-btn ${mode === 'sequential' ? 'active' : ''}`}
            onClick={() => setMode('sequential')}
          >
            Thứ tự
          </button>
          <button
            className={`lesson-mode-btn ${mode === 'random' ? 'active' : ''}`}
            onClick={() => setMode('random')}
          >
            Ngẫu nhiên
          </button>
          {mode === 'random' && (
            <button
              className="lesson-mode-btn"
              onClick={() => setDisplayOrder(shuffleArray(questions.map((_, idx) => idx)))}
            >
              🔀 Xáo lại
            </button>
          )}
          <button className="lesson-mode-btn lesson-reset-btn" onClick={handleReset}>
            ↺ Làm lại từ đầu
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">
          Câu {currentPosition + 1} / {questions.length}
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

          {currentQuestion.imageUrl && (
            <img
              src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '')}/question-images/${currentQuestion.imageUrl}`}
              alt="Minh họa câu hỏi"
              className="lesson-question-image"
            />
          )}

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
          disabled={currentPosition === 0}
          onClick={() => goToPosition(currentPosition - 1)}
        >
          ← Câu trước
        </button>
        <button
          className="lesson-nav-btn"
          disabled={currentPosition === questions.length - 1}
          onClick={() => goToPosition(currentPosition + 1)}
        >
          Câu tiếp →
        </button>
      </div>
    </div>
  );
};

export default LessonDetail;