const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchSubjectsApi() {
  const res = await fetch(`${API_URL}/subjects`);
  if (!res.ok) throw new Error('Không thể tải danh sách môn học');
  return res.json();
}

export async function fetchSubjectByIdApi(id) {
  const res = await fetch(`${API_URL}/subjects/${id}`);
  if (!res.ok) throw new Error('Không thể tải thông tin môn học');
  return res.json();
}

export async function createSubjectApi(subject) {
  const res = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject),
  });
  if (!res.ok) throw new Error('Không thể tạo môn học mới');
  return res.json();
}

export async function deleteSubjectApi(id) {
  const res = await fetch(`${API_URL}/subjects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Không thể xóa môn học');
  return id;
}

export async function updateSubjectApi(id, changes) {
  const res = await fetch(`${API_URL}/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('Không thể cập nhật môn học');
  return res.json();
}