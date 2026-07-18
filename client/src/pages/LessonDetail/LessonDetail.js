import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import { fetchQuestionsByLesson } from '../../features/questions/questionsSlice';
import { setAnswer } from '../../features/quiz/quizSlice';

const LessonDetail = () => {
  const { subjectId, lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);
  const answersForLesson = useSelector((state) => state.quiz.answers[lessonId] || {});

  // Vị trí câu hỏi đang xem, đọc từ query string (?q=), mặc định câu đầu tiên (index 0)
  const currentIndex = Math.max(0, parseInt(searchParams.get('q') || '0', 10));
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  const goToQuestion = (index) => {
    setSearchParams({ q: String(index) });
  };

  const handleSelectOption = (optionIndex) => {
    dispatch(
      setAnswer({
        lessonId,
        questionId: currentQuestion.id,
        selectedIndex: optionIndex,
      })
    );
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

  const selectedIndex = answersForLesson[currentQuestion.id];
  const answeredCount = Object.keys(answersForLesson).length;

  return (
    <div>
      <Link to={`/lessons/${subjectId}`} className="d-inline-block mb-3">
        ← Quay lại danh sách bài học
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">
          Câu {currentIndex + 1} / {questions.length}
        </h1>
        <Link to={`/lessons/${subjectId}/${lessonId}/review`}>
          Xem tất cả câu hỏi ({answeredCount}/{questions.length} đã làm)
        </Link>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>{currentQuestion.questionText}</Card.Title>
          <div className="mt-3">
            {currentQuestion.options.map((option, idx) => (
              <Button
                key={idx}
                variant={selectedIndex === idx ? 'primary' : 'outline-secondary'}
                className="d-block w-100 text-start mb-2"
                onClick={() => handleSelectOption(idx)}
              >
                {String.fromCharCode(65 + idx)}. {option}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          disabled={currentIndex === 0}
          onClick={() => goToQuestion(currentIndex - 1)}
        >
          ← Câu trước
        </Button>
        <Button
          variant="secondary"
          disabled={currentIndex === questions.length - 1}
          onClick={() => goToQuestion(currentIndex + 1)}
        >
          Câu tiếp →
        </Button>
      </div>
    </div>
  );
};

export default LessonDetail;