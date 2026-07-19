const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchLessonsBySubjectApi(subjectId) {
  const res = await fetch(`${API_URL}/lessons?subjectId=${subjectId}`);
  if (!res.ok) throw new Error('Không thể tải danh sách bài học');
  return res.json();
}

export async function fetchLessonByIdApi(id) {
  const res = await fetch(`${API_URL}/lessons/${id}`);
  if (!res.ok) throw new Error('Không thể tải thông tin bài học');
  return res.json();
}

export async function createLessonApi(lesson) {
  const res = await fetch(`${API_URL}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lesson),
  });
  if (!res.ok) throw new Error('Không thể tạo bài học mới');
  return res.json();
}

export async function deleteLessonApi(id) {
  const res = await fetch(`${API_URL}/lessons/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Không thể xóa bài học');
  return id;
}

export async function updateLessonApi(id, changes) {
  const res = await fetch(`${API_URL}/lessons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('Không thể cập nhật bài học');
  return res.json();
}

export async function fetchAllLessonsApi() {
  const res = await fetch(`${API_URL}/lessons`);
  if (!res.ok) throw new Error('Không thể tải danh sách bài học');
  return res.json();
}