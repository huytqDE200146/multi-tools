const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/subjects - lấy toàn bộ môn học
router.get('/', (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects ORDER BY id').all();
  res.json(subjects);
});

// GET /api/subjects/:id
router.get('/:id', (req, res) => {
  const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
  if (!subject) return res.status(404).json({ error: 'Subject not found' });
  res.json(subject);
});

// POST /api/subjects
router.post('/', (req, res) => {
  const { name, description = '' } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const result = db
    .prepare('INSERT INTO subjects (name, description) VALUES (?, ?)')
    .run(name.trim(), description);
  const newSubject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newSubject);
});

// PUT /api/subjects/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Subject not found' });

  const name = req.body.name ?? existing.name;
  const description = req.body.description ?? existing.description;

  db.prepare('UPDATE subjects SET name = ?, description = ? WHERE id = ?').run(
    name,
    description,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/subjects/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Subject not found' });
  db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;