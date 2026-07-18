import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Cấu trúc: answers[lessonId][questionId] = chỉ số đáp án đã chọn
  answers: {},
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { lessonId, questionId, selectedIndex } = action.payload;
      if (!state.answers[lessonId]) {
        state.answers[lessonId] = {};
      }
      state.answers[lessonId][questionId] = selectedIndex;
    },
    resetLessonAnswers: (state, action) => {
      delete state.answers[action.payload];
    },
  },
});

export const { setAnswer, resetLessonAnswers } = quizSlice.actions;
export default quizSlice.reducer;