import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Form, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  fetchQuestionsByLesson,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../features/questions/questionsSlice';
import { resetLessonAnswers } from '../../features/quiz/quizSlice';
import './ReviewGrid.css';

const emptyForm = {
  questionText: '',
  imageUrl: '',
  options: ['', ''],
  correctIndexes: [],
  explanation: '',
};

const ReviewGrid = () => {
  const { subjectId, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: questions, loading, error } = useSelector((state) => state.questions);
  const answersForLesson = useSelector((state) => state.quiz.answers[lessonId] || {});

  const [manageMode, setManageMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestionsByLesson(lessonId));
  }, [dispatch, lessonId]);

  const handleJumpToQuestion = (index) => {
    navigate(`/lessons/${subjectId}/${lessonId}?q=${index}`);
  };

  // Bật/tắt chế độ quản lý - khi BẬT, xác nhận rồi reset toàn bộ đáp án đang làm
  const toggleManageMode = () => {
    if (!manageMode) {
      const confirmed = window.confirm(
        'Chỉnh sửa câu hỏi sẽ XÓA toàn bộ tiến trình làm bài hiện tại của bạn ở bài học này. Bạn có chắc muốn tiếp tục?'
      );
      if (!confirmed) return;
      dispatch(resetLessonAnswers(lessonId));
      setManageMode(true);
    } else {
      setManageMode(false);
      setFormOpen(false);
      setEditingId(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const startAdding = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  };

  const startEditing = (q) => {
    setForm({
      questionText: q.questionText,
      imageUrl: q.imageUrl || '',
      options: [...q.options],
      correctIndexes: [...q.correctIndexes],
      explanation: q.explanation || '',
    });
    setEditingId(q.id);
    setFormOpen(true);
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOptionField = () => {
    if (form.options.length >= 6) return;
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOptionField = (idx) => {
    if (form.options.length <= 2) return;
    const newOptions = form.options.filter((_, i) => i !== idx);
    const newCorrect = form.correctIndexes
      .filter((ci) => ci !== idx)
      .map((ci) => (ci > idx ? ci - 1 : ci));
    setForm({ ...form, options: newOptions, correctIndexes: newCorrect });
  };

  const toggleCorrect = (idx) => {
    const has = form.correctIndexes.includes(idx);
    const newCorrect = has
      ? form.correctIndexes.filter((ci) => ci !== idx)
      : [...form.correctIndexes, idx];
    setForm({ ...form, correctIndexes: newCorrect });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedOptions = form.options.map((o) => o.trim());
    if (!form.questionText.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi.');
      return;
    }
    if (trimmedOptions.some((o) => !o)) {
      alert('Vui lòng điền đủ nội dung cho tất cả các đáp án.');
      return;
    }
    if (form.correctIndexes.length === 0) {
      alert('Vui lòng chọn ít nhất 1 đáp án đúng.');
      return;
    }

    const payload = {
      lessonId: Number(lessonId),
      questionText: form.questionText.trim(),
      imageUrl: form.imageUrl.trim(),
      options: trimmedOptions,
      correctIndexes: [...form.correctIndexes].sort(),
      allowMultiple: form.correctIndexes.length > 1,
      explanation: form.explanation.trim(),
      orderIndex: editingId
        ? questions.find((q) => q.id === editingId)?.orderIndex || 0
        : questions.length + 1,
    };

    if (editingId) {
      dispatch(updateQuestion({ id: editingId, changes: payload }));
    } else {
      dispatch(addQuestion(payload));
    }
    resetForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa câu hỏi này? Hành động này không thể hoàn tác.')) return;
    dispatch(deleteQuestion(id));
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

  const getCellState = (questionId) => {
    const answer = answersForLesson[questionId];
    if (!answer || !answer.submitted) return 'unanswered';
    return answer.isCorrect ? 'correct' : 'wrong';
  };

  const submittedCount = Object.values(answersForLesson).filter((a) => a.submitted).length;
  const correctCount = Object.values(answersForLesson).filter((a) => a.submitted && a.isCorrect).length;

  return (
    <div className="review-grid-dark">
      <Link to={`/lessons/${subjectId}/${lessonId}`} className="review-back-link d-inline-block mb-3">
        ← Quay lại làm bài
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="h4 mb-0">
          {manageMode
            ? `Quản lý câu hỏi (${questions.length})`
            : `Toàn bộ câu hỏi (${submittedCount}/${questions.length} đã làm — đúng ${correctCount}/${submittedCount || 0})`}
        </h1>
        <Button
          variant={manageMode ? 'outline-secondary' : 'outline-warning'}
          size="sm"
          onClick={toggleManageMode}
        >
          {manageMode ? '✕ Đóng quản lý' : '⚙ Quản lý câu hỏi'}
        </Button>
      </div>

      {manageMode ? (
        <>
          {!formOpen && (
            <Button variant="primary" className="mb-3" onClick={startAdding}>
              + Thêm câu hỏi mới
            </Button>
          )}

          {formOpen && (
            <Card className="accent-card accent-primary mb-4">
              <Card.Body>
                <h2 className="h5">{editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nội dung câu hỏi</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={form.questionText}
                      onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tên file ảnh minh họa (không bắt buộc)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="vd: cau5.png (đặt file vào server/public/question-images/)"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Label>Đáp án (tick vào ô để đánh dấu đáp án đúng)</Form.Label>
                  {form.options.map((opt, idx) => (
                    <Row key={idx} className="g-2 mb-2 align-items-center">
                      <Col xs="auto">
                        <Form.Check
                          type="checkbox"
                          checked={form.correctIndexes.includes(idx)}
                          onChange={() => toggleCorrect(idx)}
                        />
                      </Col>
                      <Col xs="auto" className="font-mono">
                        {String.fromCharCode(65 + idx)}.
                      </Col>
                      <Col>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                        />
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={form.options.length <= 2}
                          onClick={() => removeOptionField(idx)}
                        >
                          ✕
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mb-3"
                    disabled={form.options.length >= 6}
                    onClick={addOptionField}
                  >
                    + Thêm đáp án
                  </Button>

                  <Form.Group className="mb-3">
                    <Form.Label>Giải thích (không bắt buộc)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={form.explanation}
                      onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="success">
                      {editingId ? 'Lưu thay đổi' : 'Thêm câu hỏi'}
                    </Button>
                    <Button variant="outline-secondary" onClick={resetForm}>
                      Hủy
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {questions.map((q, idx) => (
            <Card key={q.id} className="mb-2 accent-card accent-info">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <span className="font-mono text-secondary me-2">#{idx + 1}</span>
                    <strong style={{ whiteSpace: 'pre-line' }}>{q.questionText}</strong>
                    {q.allowMultiple && (
                      <Badge bg="warning" text="dark" className="ms-2">
                        Multi
                      </Badge>
                    )}
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Button variant="outline-warning" size="sm" onClick={() => startEditing(q)}>
                      Sửa
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(q.id)}>
                      Xóa
                    </Button>
                  </div>
                </div>
                <ul className="mt-2 mb-0">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      style={{
                        color: q.correctIndexes.includes(i) ? 'var(--success)' : undefined,
                        fontWeight: q.correctIndexes.includes(i) ? 600 : 400,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </>
      ) : (
        <>
          <div className="review-legend mb-3">
            <span className="review-legend-item">
              <span className="review-dot correct" /> Đúng
            </span>
            <span className="review-legend-item">
              <span className="review-dot wrong" /> Sai
            </span>
            <span className="review-legend-item">
              <span className="review-dot unanswered" /> Chưa làm
            </span>
          </div>

          <div className="review-grid">
            {questions.map((question, idx) => {
              const state = getCellState(question.id);
              return (
                <button
                  key={question.id}
                  className={`review-cell ${state}`}
                  onClick={() => handleJumpToQuestion(idx)}
                  title={question.questionText}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewGrid;