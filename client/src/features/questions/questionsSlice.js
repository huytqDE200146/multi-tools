import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchQuestionsByLessonApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
} from '../../api/questionsApi';

export const fetchQuestionsByLesson = createAsyncThunk(
  'questions/fetchQuestionsByLesson',
  async (lessonId) => {
    return await fetchQuestionsByLessonApi(lessonId);
  }
);

export const addQuestion = createAsyncThunk('questions/addQuestion', async (questionData) => {
  return await createQuestionApi(questionData);
});

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async ({ id, changes }) => {
    return await updateQuestionApi(id, changes);
  }
);

export const deleteQuestion = createAsyncThunk('questions/deleteQuestion', async (id) => {
  return await deleteQuestionApi(id);
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsByLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsByLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuestionsByLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.items.findIndex((q) => q.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((q) => q.id !== action.payload);
      });
  },
});

export default questionsSlice.reducer;