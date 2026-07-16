import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TaskItem from './components/TaskItem/TaskItem';
import TaskItemClass from './components/TaskItem/TaskItemClass';

const sampleTasks = [
  { id: 1, title: 'Hoàn thành báo cáo FER202', status: 'in-progress', dueDate: '2026-07-20' },
  { id: 2, title: 'Ôn tập Redux Toolkit', status: 'todo', dueDate: '2026-07-22' },
  { id: 3, title: 'Setup project Multi Tools', status: 'done', dueDate: '2026-07-13' },
];

function App() {
  return (
    <div className="App container py-4">
      <h1 className="mb-4">Multi Tools — Demo LO2: TaskItem component</h1>

      <h2 className="h5 mt-4">Functional Component (TaskItem)</h2>
      {sampleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}

      <h2 className="h5 mt-4">Class Component (TaskItemClass)</h2>
      {sampleTasks.map((task) => (
        <TaskItemClass key={task.id} task={task} />
      ))}
    </div>
  );
}

export default App;