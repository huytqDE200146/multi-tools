import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TaskList from './components/TaskList/TaskList';
import StatsSummary from './components/StatsSummary/StatsSummary';

const sampleTasks = [
  { id: 1, title: 'Hoàn thành báo cáo FER202', status: 'in-progress', dueDate: '2026-07-20' },
  { id: 2, title: 'Ôn tập Redux Toolkit', status: 'todo', dueDate: '2026-07-22' },
  { id: 3, title: 'Setup project Multi Tools', status: 'done', dueDate: '2026-07-13' },
];

function App() {
  return (
    <div className="App container py-4">
      <h1 className="mb-4">Multi Tools</h1>

      <StatsSummary userName="Huy" tasks={sampleTasks} />

      <h2 className="h5 mt-4">Danh sách nhiệm vụ</h2>
      <TaskList tasks={sampleTasks} />
    </div>
  );
}

export default App;