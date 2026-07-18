import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import TaskList from '../../components/TaskList/TaskList';
import { addTask, toggleTaskStatus, deleteTask } from '../../features/tasks/tasksSlice';
import { PRIORITY_ORDER } from '../../constants/priority';

const Tasks = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  // --- State cho form thêm task ---
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  // --- State cho sắp xếp và tìm kiếm ---
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dispatch(
      addTask({
        id: Date.now(),
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

  const handleToggleStatus = (id) => dispatch(toggleTaskStatus(id));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));

  // useMemo: chỉ tính lại danh sách đã lọc+sắp xếp khi tasks/sortBy/searchTerm thay đổi
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
          // Task chưa có ngày (null) đẩy xuống cuối
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

      <p className="text-muted">
        Hiển thị {visibleTasks.length} / {tasks.length} nhiệm vụ
      </p>

      <TaskList
        tasks={visibleTasks}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Tasks;