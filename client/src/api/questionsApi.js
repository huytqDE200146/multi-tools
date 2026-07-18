const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchQuestionsByLessonApi(lessonId) {
  const res = await fetch(`${API_URL}/questions?lessonId=${lessonId}`);
  if (!res.ok) throw new Error('Không thể tải danh sách câu hỏi');
  return res.json();
}