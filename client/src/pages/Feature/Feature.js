import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Row, Col, Spinner, Alert, ListGroup } from 'react-bootstrap';
import TaskList from '../../components/TaskList/TaskList';
import { addTask, toggleTaskStatus, deleteTask } from '../../features/tasks/tasksSlice';

const Feature = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [errorHolidays, setErrorHolidays] = useState(null);

  useEffect(() => {
    document.title = `Multi Tools (${tasks.length} nhiệm vụ)`;
  }, [tasks]);

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoadingHolidays(true);
      setErrorHolidays(null);
      try {
        const response = await fetch('https://date.nager.at/api/v4/Holidays/VN/2026');
        if (!response.ok) {
          throw new Error(`Lỗi API: ${response.status}`);
        }
        const data = await response.json();
        setHolidays(data);
      } catch (err) {
        setErrorHolidays(err.message || 'Không thể tải danh sách ngày lễ.');
      } finally {
        setLoadingHolidays(false);
      }
    };

    fetchHolidays();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dispatch(
      addTask({
        id: Date.now(),
        title: newTitle.trim(),
        status: 'todo',
        dueDate: newDueDate || null,
      })
    );

    setNewTitle('');
    setNewDueDate('');
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleTaskStatus(id));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  return (
    <div>
      <h1>Lịch & Nhiệm vụ</h1>

      <div className="mb-4">
        <h2 className="h5">Ngày lễ Việt Nam 2026</h2>
        {loadingHolidays && (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Đang tải danh sách ngày lễ...</span>
          </div>
        )}
        {errorHolidays && <Alert variant="danger">{errorHolidays}</Alert>}
        {!loadingHolidays && !errorHolidays && (
          <ListGroup>
            {holidays.slice(0, 5).map((holiday) => (
              <ListGroup.Item key={holiday.date}>
                <strong>{holiday.date}</strong> — {holiday.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

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