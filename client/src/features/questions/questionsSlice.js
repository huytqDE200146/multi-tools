import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuestionsByLessonApi } from '../../api/questionsApi';

export const fetchQuestionsByLesson = createAsyncThunk(
  'questions/fetchQuestionsByLesson',
  async (lessonId) => {
    return await fetchQuestionsByLessonApi(lessonId);
  }
);

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
      });
  },
});

export default questionsSlice.reducer;