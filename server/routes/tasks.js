const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/tasks - lấy toàn bộ nhiệm vụ
router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all();
  res.json(tasks);
});

// GET /api/tasks/:id - lấy 1 nhiệm vụ theo id
router.get('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /api/tasks - tạo nhiệm vụ mới
router.post('/', (req, res) => {
  const { title, status = 'todo', dueDate = null } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const result = db
    .prepare('INSERT INTO tasks (title, status, dueDate) VALUES (?, ?, ?)')
    .run(title.trim(), status, dueDate);
  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - cập nhật nhiệm vụ
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });

  const title = req.body.title ?? existing.title;
  const status = req.body.status ?? existing.status;
  const dueDate = req.body.dueDate ?? existing.dueDate;

  db.prepare('UPDATE tasks SET title = ?, status = ?, dueDate = ? WHERE id = ?').run(
    title,
    status,
    dueDate,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/tasks/:id - xóa nhiệm vụ
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;