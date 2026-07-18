import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { fetchLessonsBySubject, addLesson, deleteLesson } from '../../features/lessons/lessonsSlice';
import { fetchSubjectByIdApi } from '../../api/subjectsApi';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();

  const { items: lessons, loading, error } = useSelector((state) => state.lessons);

  const [subject, setSubject] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    dispatch(fetchLessonsBySubject(subjectId));
  }, [dispatch, subjectId]);

  useEffect(() => {
    fetchSubjectByIdApi(subjectId)
      .then(setSubject)
      .catch(() => setSubject(null));
  }, [subjectId]);

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    dispatch(
      addLesson({
        subjectId: Number(subjectId),
        title: newTitle.trim(),
        description: newDescription.trim(),
      })
    );
    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteLesson = (id) => {
    dispatch(deleteLesson(id));
  };

  return (
    <div>
      <Link to="/lessons" className="d-inline-block mb-3">
        ← Quay lại danh sách môn học
      </Link>

      <h1>{subject ? subject.name : 'Đang tải...'}</h1>
      {subject?.description && <p className="text-muted">{subject.description}</p>}

      <Form onSubmit={handleAddLesson} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label>Tên bài học</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: Bài 1 - Component"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              type="text"
              placeholder="Mô tả ngắn (không bắt buộc)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Thêm bài học
            </Button>
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Đang tải danh sách bài học...</span>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && lessons.length === 0 && (
        <p className="text-muted">Chưa có bài học nào trong môn này.</p>
      )}

      <Row xs={1} md={2} className="g-3">
        {lessons.map((lesson) => (
          <Col key={lesson.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title>
                  <Link to={`/lessons/${subjectId}/${lesson.id}`} className="text-decoration-none">
                    {lesson.title}
                  </Link>
                </Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                    {lesson.description || 'Không có mô tả.'}
                    </Card.Text>
                    <div className="d-flex gap-2">
                    <Link
                        to={`/lessons/${subjectId}/${lesson.id}/study`}
                        className="btn btn-outline-info btn-sm"
                    >
                        Học
                    </Link>
                    <Link
                        to={`/lessons/${subjectId}/${lesson.id}`}
                        className="btn btn-outline-primary btn-sm"
                    >
                        Thi
                    </Link>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteLesson(lesson.id)}
                    >
                        Xóa
                    </Button>
                    </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SubjectDetail;