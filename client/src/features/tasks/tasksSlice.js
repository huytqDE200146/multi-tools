import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from '../../api/tasksApi';

// --- Async Thunks: mỗi thunk đại diện cho 1 lời gọi API bất đồng bộ ---

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await fetchTasksApi();
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
  return await createTaskApi(taskData);
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, changes }) => {
  return await updateTaskApi(id, changes);
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  return await deleteTaskApi(id);
});

// Đổi trạng thái vẫn dùng updateTask, nhưng viết 1 thunk riêng cho tiện gọi
export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (task) => {
    const nextStatus =
      task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    return await updateTaskApi(task.id, { status: nextStatus });
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchTasks ---
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // --- addTask ---
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // --- updateTask ---
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // --- toggleTaskStatus ---
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // --- deleteTask ---
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;