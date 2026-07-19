import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Form, Button, Alert } from 'react-bootstrap';
import { updateTask } from '../../features/tasks/tasksSlice';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../constants/priority';

const TaskDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const task = useSelector((state) =>
    state.tasks.items.find((t) => String(t.id) === id)
  );

  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
    }
  }, [task]);

  if (!task) {
    return (
      <div>
        <Alert variant="warning">Không tìm thấy nhiệm vụ này (có thể đã bị xóa).</Alert>
        <Link to="/tasks">← Quay lại danh sách nhiệm vụ</Link>
      </div>
    );
  }

  const statusLabel =
    task.status === 'done' ? 'Hoàn thành' : task.status === 'in-progress' ? 'Đang làm' : 'Chưa làm';
  const statusVariant =
    task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'secondary';

  const handleSaveDescription = (e) => {
    e.preventDefault();
    dispatch(updateTask({ id: task.id, changes: { description } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Link to="/tasks" className="d-inline-block mb-3">
        ← Quay lại danh sách nhiệm vụ
      </Link>

      <h1>{task.title}</h1>

      <div className="mb-3">
        <Badge bg={statusVariant} className="me-2">
          {statusLabel}
        </Badge>
        {task.priority && (
          <Badge bg={PRIORITY_COLORS[task.priority]} className="me-2">
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        )}
        {task.dueDate && <span className="text-muted">Hạn: {task.dueDate}</span>}
      </div>

      <Form onSubmit={handleSaveDescription}>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả chi tiết</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Nhập mô tả cho nhiệm vụ này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Lưu mô tả
        </Button>
        {saved && <span className="ms-3 text-success">Đã lưu!</span>}
      </Form>
    </div>
  );
};

export default TaskDetail;