import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import StatsSummary from '../../components/StatsSummary/StatsSummary';
import TaskList from '../../components/TaskList/TaskList';
import { fetchTasks, toggleTaskStatus, deleteTask } from '../../features/tasks/tasksSlice';

const Home = () => {
  const { items: tasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleToggleStatus = (task) => dispatch(toggleTaskStatus(task));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));

  return (
    <div>
      <StatsSummary userName="Huy" tasks={tasks} />

      <h2 className="h5 mt-4">Danh sách nhiệm vụ gần đây</h2>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" />
          <span>Đang tải nhiệm vụ...</span>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <TaskList tasks={tasks} onToggleStatus={handleToggleStatus} onDelete={handleDeleteTask} />
      )}
    </div>
  );
};

export default Home;