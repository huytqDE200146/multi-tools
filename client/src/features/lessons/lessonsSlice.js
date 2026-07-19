import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchLessonsBySubjectApi,
  createLessonApi,
  updateLessonApi,
  deleteLessonApi,
} from '../../api/lessonsApi';

export const fetchLessonsBySubject = createAsyncThunk(
  'lessons/fetchLessonsBySubject',
  async (subjectId) => {
    return await fetchLessonsBySubjectApi(subjectId);
  }
);

export const addLesson = createAsyncThunk('lessons/addLesson', async (lessonData) => {
  return await createLessonApi(lessonData);
});

export const updateLesson = createAsyncThunk(
  'lessons/updateLesson',
  async ({ id, changes }) => {
    return await updateLessonApi(id, changes);
  }
);

export const deleteLesson = createAsyncThunk('lessons/deleteLesson', async (id) => {
  return await deleteLessonApi(id);
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonsBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLessonsBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const idx = state.items.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
      });
  },
});

export default lessonsSlice.reducer;