import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Card } from 'react-bootstrap';
import { fetchQuestionsByLesson } from '../../features/questions/questionsSlice';
import '../LessonDetail/LessonDetail.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SERVER_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(
  '/api',
  ''
);

const StudyMode = () => {
  const { subjectId, lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);

  const currentIndex = Math.max(0, parseInt(searchParams.get('q') || '0', 10));
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  const goToQuestion = (index) => {
    const clamped = Math.min(Math.max(index, 0), questions.length - 1);
    setSearchParams({ q: String(clamped) });
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') goToQuestion(currentIndex + 1);
      if (e.key === 'ArrowLeft') goToQuestion(currentIndex - 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions.length]);

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

  return (
    <div className="lesson-detail-dark">
      <Link to={`/lessons/${subjectId}`} className="d-inline-block mb-3 lesson-back-link">
        ← Quay lại danh sách bài học
      </Link>

      <h1 className="h4 mb-3">
        Học — Câu {currentIndex + 1} / {questions.length}
      </h1>

      <Card className="mb-3 lesson-question-card">
        <Card.Body>
          <Card.Title className="lesson-question-text">{currentQuestion.questionText}</Card.Title>

          {currentQuestion.imageUrl && (
            <img
              src={`${SERVER_URL}/question-images/${currentQuestion.imageUrl}`}
              alt="Minh họa câu hỏi"
              className="lesson-question-image"
            />
          )}

          <div className="mt-3">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = currentQuestion.correctIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`lesson-option-btn ${isCorrect ? 'lesson-option-correct' : 'lesson-option-default'}`}
                >
                  <span className="lesson-option-letter">{OPTION_LETTERS[idx]}</span>
                  {option}
                  {isCorrect && <span className="study-correct-tag"> ✓ Đáp án đúng</span>}
                </div>
              );
            })}
          </div>

          {currentQuestion.explanation && (
            <div className="lesson-explanation mt-3">{currentQuestion.explanation}</div>
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

export default StudyMode;