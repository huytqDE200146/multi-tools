import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      title: 'Hoàn thành báo cáo FER202',
      status: 'in-progress',
      dueDate: '2026-07-20',
      priority: 'extreme',
      description: '',
    },
    {
      id: 2,
      title: 'Ôn tập Redux Toolkit',
      status: 'todo',
      dueDate: '2026-07-22',
      priority: 'high',
      description: '',
    },
    {
      id: 3,
      title: 'Setup project Multi Tools',
      status: 'done',
      dueDate: '2026-07-13',
      priority: 'medium',
      description: '',
    },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((t) => t.id === action.payload);
      if (!task) return;
      task.status =
        task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    updateTask: (state, action) => {
      const { id, changes } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (!task) return;
      Object.assign(task, changes);
    },
  },
});

export const { addTask, toggleTaskStatus, deleteTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;