const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchTasksApi() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error('Không thể tải danh sách nhiệm vụ');
  return res.json();
}

export async function createTaskApi(task) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Không thể tạo nhiệm vụ mới');
  return res.json();
}

export async function updateTaskApi(id, changes) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('Không thể cập nhật nhiệm vụ');
  return res.json();
}

export async function deleteTaskApi(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Không thể xóa nhiệm vụ');
  return id;
}