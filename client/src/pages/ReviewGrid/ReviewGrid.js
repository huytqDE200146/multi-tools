import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { fetchQuestionsByLesson } from '../../features/questions/questionsSlice';
import './ReviewGrid.css';

const ReviewGrid = () => {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);
  const answersForLesson = useSelector((state) => state.quiz.answers[lessonId] || {});

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  const handleJumpToQuestion = (index) => {
    navigate(`/lessons/${subjectId}/${lessonId}?q=${index}`);
  };

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

  const answeredCount = Object.keys(answersForLesson).length;

  return (
    <div>
      <Link to={`/lessons/${subjectId}/${lessonId}`} className="d-inline-block mb-3">
        ← Quay lại làm bài
      </Link>

      <h1 className="h4">Toàn bộ câu hỏi ({answeredCount}/{questions.length} đã làm)</h1>

      <div className="review-legend mb-3">
        <span className="review-legend-item">
          <span className="review-dot answered" /> Đã trả lời
        </span>
        <span className="review-legend-item">
          <span className="review-dot unanswered" /> Chưa trả lời
        </span>
      </div>

      <div className="review-grid">
        {questions.map((question, idx) => {
          const isAnswered = answersForLesson[question.id] !== undefined;
          return (
            <button
              key={question.id}
              className={`review-cell ${isAnswered ? 'answered' : 'unanswered'}`}
              onClick={() => handleJumpToQuestion(idx)}
              title={question.questionText}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewGrid;