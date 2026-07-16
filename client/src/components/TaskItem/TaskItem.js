import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function TaskItem({ task, onToggleStatus, onDelete }) {
  const { title, status, dueDate } = task;

  const statusVariant =
    status === 'done' ? 'success' : status === 'in-progress' ? 'warning' : 'secondary';

  const statusLabel = `${status === 'done' ? 'Hoàn thành' : status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}`;

  return (
    <Card className="mb-2 shadow-sm task-item">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-1 fs-6">{title}</Card.Title>
          <Badge bg={statusVariant} className="me-2">
            {statusLabel}
          </Badge>
          {dueDate && <small className="text-muted">Hạn: {dueDate}</small>}
        </div>
        <div className="task-item-actions">
          {onToggleStatus && (
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => onToggleStatus(task.id)}
            >
              Đổi trạng thái
            </button>
          )}
          {onDelete && (
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.id)}>
              Xóa
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskItem;