import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchSubjectsApi,
  createSubjectApi,
  updateSubjectApi,
  deleteSubjectApi,
} from '../../api/subjectsApi';

export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async () => {
  return await fetchSubjectsApi();
});

export const addSubject = createAsyncThunk('subjects/addSubject', async (subjectData) => {
  return await createSubjectApi(subjectData);
});

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, changes }) => {
    return await updateSubjectApi(id, changes);
  }
);

export const deleteSubject = createAsyncThunk('subjects/deleteSubject', async (id) => {
  return await deleteSubjectApi(id);
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export default subjectsSlice.reducer;