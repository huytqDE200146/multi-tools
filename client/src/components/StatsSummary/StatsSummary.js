import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const StatsSummary = ({ userName, tasks }) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = total - done - inProgress;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Card className="mb-4 bg-light">
      <Card.Body>
        <Card.Title>{`Xin chào, ${userName}!`}</Card.Title>
        <Row className="text-center mt-3">
          <Col>
            <div className="fs-4 fw-bold">{total}</div>
            <small className="text-muted">Tổng nhiệm vụ</small>
          </Col>
          <Col>
            <div className="fs-4 fw-bold text-secondary">{todo}</div>
            <small className="text-muted">Chưa làm</small>
          </Col>
          <Col>
            <div className="fs-4 fw-bold text-warning">{inProgress}</div>
            <small className="text-muted">Đang làm</small>
          </Col>
          <Col>
            <div className="fs-4 fw-bold text-success">{done}</div>
            <small className="text-muted">Hoàn thành</small>
          </Col>
        </Row>
        <p className="text-center mt-3 mb-0">
          {`Tiến độ hoàn thành: ${completionRate}%`}
        </p>
      </Card.Body>
    </Card>
  );
};

export default StatsSummary;