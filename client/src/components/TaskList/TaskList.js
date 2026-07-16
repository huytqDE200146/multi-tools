import React from 'react';
import TaskItem from '../TaskItem/TaskItem';

const TaskList = ({ tasks, onToggleStatus, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="text-muted">Chưa có nhiệm vụ nào.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;