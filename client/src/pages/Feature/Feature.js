import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import TaskList from '../../components/TaskList/TaskList';

const initialTasks = [
  { id: 1, title: 'Hoàn thành báo cáo FER202', status: 'in-progress', dueDate: '2026-07-20' },
  { id: 2, title: 'Ôn tập Redux Toolkit', status: 'todo', dueDate: '2026-07-22' },
  { id: 3, title: 'Setup project Multi Tools', status: 'done', dueDate: '2026-07-13' },
];

const Feature = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    document.title = `Multi Tools (${tasks.length} nhiệm vụ)`;
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      status: 'todo',
      dueDate: newDueDate || null,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTitle('');
    setNewDueDate('');
  };

  const handleToggleStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== id) return task;
        const nextStatus =
          task.status === 'todo'
            ? 'in-progress'
            : task.status === 'in-progress'
            ? 'done'
            : 'todo';
        return { ...task, status: nextStatus };
      })
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h1>Lịch & Nhiệm vụ</h1>

      <Form onSubmit={handleAddTask} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={6}>
            <Form.Label>Tên nhiệm vụ</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập nhiệm vụ mới..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Hạn hoàn thành</Form.Label>
            <Form.Control
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Thêm
            </Button>
          </Col>
        </Row>
      </Form>

      <TaskList
        tasks={tasks}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Feature;