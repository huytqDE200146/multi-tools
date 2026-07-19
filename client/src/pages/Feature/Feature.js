import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import MonthCalendar from '../../components/Calendar/MonthCalendar';
import TaskItem from '../../components/TaskItem/TaskItem';
import { toggleTaskStatus, deleteTask } from '../../features/tasks/tasksSlice';
import { formatDateDisplay } from '../../utils/formatDate';

const Feature = () => {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // "YYYY-MM-DD" hoặc null

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

  const goToPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToggleStatus = (id) => dispatch(toggleTaskStatus(id));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));

  const extremeTasks = useMemo(
    () => tasks.filter((t) => t.priority === 'extreme' && t.status !== 'done'),
    [tasks]
  );

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'done' && t.dueDate)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 3);
  }, [tasks]);

  const noDeadlineTasks = useMemo(() => {
  return tasks.filter((t) => t.status !== 'done' && !t.dueDate).slice(0, 3);
}, [tasks]);

  // Nhiệm vụ thuộc ngày đang được chọn (nếu có)
  const tasksOfSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((t) => t.dueDate === selectedDate);
  }, [tasks, selectedDate]);

  // --- Chế độ xem nhiệm vụ theo ngày ---
  if (selectedDate) {
    return (
      <div>
        <Button variant="outline-secondary" className="mb-3" onClick={() => setSelectedDate(null)}>
          ← Quay lại Lịch
        </Button>

        <h1>Nhiệm vụ ngày {formatDateDisplay(selectedDate)}</h1>

        {tasksOfSelectedDate.length === 0 ? (
          <p className="text-muted">Không có nhiệm vụ nào trong ngày này.</p>
        ) : (
          tasksOfSelectedDate.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    );
  }

  // --- Chế độ xem Lịch bình thường ---
  return (
    <div>
      <h1>Lịch</h1>

      <MonthCalendar
        tasks={tasks}
        currentDate={currentDate}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onSelectDay={setSelectedDate}
      />

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
                <strong>{formatDateDisplay(holiday.date)}</strong> — {holiday.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      <div className="mb-4">
        <h2 className="h5">Nhiệm vụ ưu tiên cực cao</h2>
        {extremeTasks.length === 0 ? (
          <p className="text-muted">Không có nhiệm vụ nào ở mức ưu tiên cực cao.</p>
        ) : (
          extremeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      <div>
        <h2 className="h5">3 nhiệm vụ sắp tới gần nhất</h2>
        {upcomingTasks.length === 0 ? (
          <p className="text-muted">Không có nhiệm vụ nào sắp tới hạn.</p>
        ) : (
          upcomingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
      <div className="mt-4">
        <h2 className="h5">Nhiệm vụ chưa có hạn</h2>
        {noDeadlineTasks.length === 0 ? (
          <p className="text-muted">Không có nhiệm vụ nào thiếu hạn hoàn thành.</p>
        ) : (
          noDeadlineTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feature;