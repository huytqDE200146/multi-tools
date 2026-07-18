const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/lessons?subjectId=1 - lấy bài học, có thể lọc theo môn học
router.get('/', (req, res) => {
  const { subjectId } = req.query;
  let lessons;
  if (subjectId) {
    lessons = db.prepare('SELECT * FROM lessons WHERE subjectId = ? ORDER BY id').all(subjectId);
  } else {
    lessons = db.prepare('SELECT * FROM lessons ORDER BY id').all();
  }
  res.json(lessons);
});

// GET /api/lessons/:id
router.get('/:id', (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

// POST /api/lessons
router.post('/', (req, res) => {
  const { subjectId, title, description = '' } = req.body;
  if (!subjectId || !title || !title.trim()) {
    return res.status(400).json({ error: 'subjectId and title are required' });
  }
  const result = db
    .prepare('INSERT INTO lessons (subjectId, title, description) VALUES (?, ?, ?)')
    .run(subjectId, title.trim(), description);
  const newLesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newLesson);
});

// PUT /api/lessons/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Lesson not found' });

  const title = req.body.title ?? existing.title;
  const description = req.body.description ?? existing.description;

  db.prepare('UPDATE lessons SET title = ?, description = ? WHERE id = ?').run(
    title,
    description,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/lessons/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Lesson not found' });
  db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;