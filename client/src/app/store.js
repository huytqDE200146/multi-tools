import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasks/tasksSlice';
import subjectsReducer from '../features/subjects/subjectsSlice';
import lessonsReducer from '../features/lessons/lessonsSlice';
import questionsReducer from '../features/questions/questionsSlice';
import quizReducer from '../features/quiz/quizSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    subjects: subjectsReducer,
    lessons: lessonsReducer,
    questions: questionsReducer,
    quiz: quizReducer,
  },
});