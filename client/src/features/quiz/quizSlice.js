import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // answers[lessonId][questionId] = { selected: [số index đã chọn], submitted: bool, isCorrect: bool }
  answers: {},
};

function getOrCreateLessonAnswers(state, lessonId) {
  if (!state.answers[lessonId]) {
    state.answers[lessonId] = {};
  }
  return state.answers[lessonId];
}

function getOrCreateQuestionAnswer(state, lessonId, questionId) {
  const lessonAnswers = getOrCreateLessonAnswers(state, lessonId);
  if (!lessonAnswers[questionId]) {
    lessonAnswers[questionId] = { selected: [], submitted: false, isCorrect: false };
  }
  return lessonAnswers[questionId];
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Chọn/bỏ chọn 1 đáp án (chưa submit) - hỗ trợ cả single và multi choice
    toggleOption: (state, action) => {
      const { lessonId, questionId, optionIndex, allowMultiple } = action.payload;
      const answer = getOrCreateQuestionAnswer(state, lessonId, questionId);

      if (answer.submitted) return; // đã submit thì không cho đổi nữa

      if (allowMultiple) {
        const pos = answer.selected.indexOf(optionIndex);
        if (pos === -1) {
          answer.selected.push(optionIndex);
        } else {
          answer.selected.splice(pos, 1);
        }
      } else {
        answer.selected = [optionIndex];
      }
    },

    // Submit câu hỏi hiện tại, tính đúng/sai dựa trên correctIndexes
    submitAnswer: (state, action) => {
      const { lessonId, questionId, correctIndexes } = action.payload;
      const answer = getOrCreateQuestionAnswer(state, lessonId, questionId);

      if (answer.submitted) return; // tránh submit lại nhiều lần
      if (answer.selected.length === 0) return; // chưa chọn gì thì không submit

      const selectedSorted = [...answer.selected].sort();
      const correctSorted = [...correctIndexes].sort();
      const isCorrect =
        selectedSorted.length === correctSorted.length &&
        selectedSorted.every((val, idx) => val === correctSorted[idx]);

      answer.submitted = true;
      answer.isCorrect = isCorrect;
    },

    resetLessonAnswers: (state, action) => {
      delete state.answers[action.payload];
    },
  },
});

export const { toggleOption, submitAnswer, resetLessonAnswers } = quizSlice.actions;
export default quizSlice.reducer;