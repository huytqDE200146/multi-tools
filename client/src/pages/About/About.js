import React from 'react';
import { Card } from 'react-bootstrap';

const About = () => {
  return (
    <div>
      <h1>Giới thiệu</h1>
      <Card className="accent-card accent-primary">
        <Card.Body>
          <p>
            <strong>Multi Tools</strong> là ứng dụng web cá nhân kết hợp Lịch, Task Tracker,
            Lessons (trắc nghiệm ôn tập) và Ghi chú, giúp quản lý thời gian và học tập hiệu quả hơn.
          </p>
          <p className="mb-0 text-secondary">
            Dự án được xây dựng cho môn FER202 - React, sử dụng React, Redux Toolkit, React Router,
            React-Bootstrap ở frontend, và Node.js/Express/SQLite ở backend.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default About;