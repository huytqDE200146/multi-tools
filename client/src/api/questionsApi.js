const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchQuestionsByLessonApi(lessonId) {
  const res = await fetch(`${API_URL}/questions?lessonId=${lessonId}`);
  if (!res.ok) throw new Error('Không thể tải danh sách câu hỏi');
  return res.json();
}

export async function createQuestionApi(question) {
  const res = await fetch(`${API_URL}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error('Không thể tạo câu hỏi mới');
  return res.json();
}

export async function updateQuestionApi(id, changes) {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('Không thể cập nhật câu hỏi');
  return res.json();
}

export async function deleteQuestionApi(id) {
  const res = await fetch(`${API_URL}/questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Không thể xóa câu hỏi');
  return id;
}