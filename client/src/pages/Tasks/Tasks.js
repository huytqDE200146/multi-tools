import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import TaskList from '../../components/TaskList/TaskList';
import { fetchTasks, addTask, toggleTaskStatus, deleteTask } from '../../features/tasks/tasksSlice';
import { PRIORITY_ORDER } from '../../constants/priority';

const Tasks = () => {
  const { items: tasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dispatch(
      addTask({
        title: newTitle.trim(),
        status: 'todo',
        dueDate: newDueDate || null,
        priority: newPriority,
      })
    );

    setNewTitle('');
    setNewDueDate('');
    setNewPriority('medium');
  };

  const handleToggleStatus = (task) => dispatch(toggleTaskStatus(task));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((t) =>
      t.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'priority':
          return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'date':
        default:
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
      }
    });

    return sorted;
  }, [tasks, sortBy, searchTerm]);

  return (
    <div>
      <h1>Nhiệm vụ</h1>

      <Form onSubmit={handleAddTask} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col md={4}>
            <Form.Label>Tên nhiệm vụ</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập nhiệm vụ mới..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Hạn hoàn thành</Form.Label>
            <Form.Control
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Độ ưu tiên</Form.Label>
            <Form.Select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="extreme">Cực cao</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Thêm
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="g-2 mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên nhiệm vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sắp xếp theo: Ngày hết hạn</option>
            <option value="name">Sắp xếp theo: Tên</option>
            <option value="priority">Sắp xếp theo: Độ ưu tiên</option>
            <option value="status">Sắp xếp theo: Trạng thái</option>
          </Form.Select>
        </Col>
      </Row>

      {loading && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <Spinner animation="border" size="sm" />
          <span>Đang tải nhiệm vụ...</span>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <p className="text-muted">
            Hiển thị {visibleTasks.length} / {tasks.length} nhiệm vụ
          </p>
          <TaskList
            tasks={visibleTasks}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTask}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;