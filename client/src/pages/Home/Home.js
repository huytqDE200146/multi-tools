import React from 'react';
import StatsSummary from '../../components/StatsSummary/StatsSummary';
import TaskList from '../../components/TaskList/TaskList';

const sampleTasks = [
  { id: 1, title: 'Hoàn thành báo cáo FER202', status: 'in-progress', dueDate: '2026-07-20' },
  { id: 2, title: 'Ôn tập Redux Toolkit', status: 'todo', dueDate: '2026-07-22' },
  { id: 3, title: 'Setup project Multi Tools', status: 'done', dueDate: '2026-07-13' },
];

const Home = () => {
  return (
    <div>
      <StatsSummary userName="Huy" tasks={sampleTasks} />
      <h2 className="h5 mt-4">Danh sách nhiệm vụ gần đây</h2>
      <TaskList tasks={sampleTasks} />
    </div>
  );
};

export default Home;