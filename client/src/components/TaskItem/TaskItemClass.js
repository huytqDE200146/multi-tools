import React from 'react';
import { Card, Badge } from 'react-bootstrap';

class TaskItemClass extends React.Component {
  getStatusVariant() {
    const { status } = this.props.task;
    if (status === 'done') return 'success';
    if (status === 'in-progress') return 'warning';
    return 'secondary';
  }

  getStatusLabel() {
    const { status } = this.props.task;
    if (status === 'done') return 'Hoàn thành';
    if (status === 'in-progress') return 'Đang làm';
    return 'Chưa làm';
  }

  render() {
    const { task, onToggleStatus, onDelete } = this.props;
    const { title, dueDate, id } = task;

    return (
      <Card className="mb-2 shadow-sm task-item">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="mb-1 fs-6">{title}</Card.Title>
            <Badge bg={this.getStatusVariant()} className="me-2">
              {this.getStatusLabel()}
            </Badge>
            {dueDate && <small className="text-muted">Hạn: {dueDate}</small>}
          </div>
          <div className="task-item-actions">
            {onToggleStatus && (
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => onToggleStatus(id)}
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
}

export default TaskItemClass;