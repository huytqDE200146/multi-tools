import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../constants/priority';
import './TaskItem.css';

function TaskItem({ task, onToggleStatus, onDelete }) {
  const { id, title, status, dueDate, priority } = task;

  const statusVariant =
    status === 'done' ? 'success' : status === 'in-progress' ? 'warning' : 'secondary';

  const statusLabel = `${status === 'done' ? 'Hoàn thành' : status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}`;

  return (
    <Card className={`mb-2 shadow-sm task-item status-${status}`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-1 fs-6">
            <Link to={`/tasks/${id}`} className="text-decoration-none">
              {title}
            </Link>
          </Card.Title>
          <Badge bg={statusVariant} className="me-2">
            {statusLabel}
          </Badge>
          {priority && (
            <Badge bg={PRIORITY_COLORS[priority]} className="me-2">
              {PRIORITY_LABELS[priority]}
            </Badge>
          )}
          {dueDate && <small className="text-muted">Hạn: {dueDate}</small>}
        </div>
        <div className="task-item-actions">
          {onToggleStatus && (
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => onToggleStatus(task)}
            >
              Đổi trạng thái
            </button>
          )}
          {onDelete && (
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(id)}>
              Xóa
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskItem;