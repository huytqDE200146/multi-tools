import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import {
  fetchSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from '../../features/subjects/subjectsSlice';

const Lessons = () => {
  const { items: subjects, loading, error } = useSelector((state) => state.subjects);
  const dispatch = useDispatch();

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch(addSubject({ name: newName.trim(), description: newDescription.trim() }));
    setNewName('');
    setNewDescription('');
  };

  const handleDeleteSubject = (id) => {
    dispatch(deleteSubject(id));
  };

  const startEditing = (subject) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditDescription(subject.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEditing = (id) => {
    if (!editName.trim()) return;
    dispatch(
      updateSubject({
        id,
        changes: { name: editName.trim(), description: editDescription.trim() },
      })
    );
    setEditingId(null);
  };

  return (
    <div>
      <h1>Môn học</h1>

      <Form onSubmit={handleAddSubject} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label>Tên môn học</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ví dụ: FER202 - React"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
              Thêm môn học
            </Button>
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Đang tải danh sách môn học...</span>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-muted">Chưa có môn học nào. Thêm môn học đầu tiên ở form trên.</p>
      )}

      <Row xs={1} md={2} lg={3} className="g-3">
        {subjects.map((subject) => (
          <Col key={subject.id}>
            <Card className="h-100 shadow-sm accent-card accent-info">
              <Card.Body className="d-flex flex-column">
                {editingId === subject.id ? (
                  <>
                    <Form.Control
                      type="text"
                      className="mb-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Tên môn học"
                    />
                    <Form.Control
                      type="text"
                      className="mb-3"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Mô tả"
                    />
                    <div className="d-flex gap-2 mt-auto">
                      <Button variant="success" size="sm" onClick={() => saveEditing(subject.id)}>
                        Lưu
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={cancelEditing}>
                        Hủy
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card.Title>
                      <Link to={`/lessons/${subject.id}`} className="text-decoration-none">
                        {subject.name}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                      {subject.description || 'Không có mô tả.'}
                    </Card.Text>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => startEditing(subject)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Lessons;