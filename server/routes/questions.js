const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Chuyển row từ DB (options là chuỗi JSON) thành object JS (options là mảng thật)
function parseQuestion(row) {
  if (!row) return row;
  return { ...row, options: JSON.parse(row.options) };
}

// GET /api/questions?lessonId=1 - lấy câu hỏi của 1 bài học, sắp theo thứ tự
router.get('/', (req, res) => {
  const { lessonId } = req.query;
  let questions;
  if (lessonId) {
    questions = db
      .prepare('SELECT * FROM questions WHERE lessonId = ? ORDER BY orderIndex, id')
      .all(lessonId);
  } else {
    questions = db.prepare('SELECT * FROM questions ORDER BY lessonId, orderIndex, id').all();
  }
  res.json(questions.map(parseQuestion));
});

// GET /api/questions/:id
router.get('/:id', (req, res) => {
  const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  res.json(parseQuestion(question));
});

// POST /api/questions
router.post('/', (req, res) => {
  const {
    lessonId,
    questionText,
    options,
    correctIndex,
    explanation = '',
    orderIndex = 0,
  } = req.body;

  if (!lessonId || !questionText || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({
      error: 'lessonId, questionText, and at least 2 options are required',
    });
  }
  if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex >= options.length) {
    return res.status(400).json({ error: 'correctIndex must be a valid index into options' });
  }

  const result = db
    .prepare(
      'INSERT INTO questions (lessonId, questionText, options, correctIndex, explanation, orderIndex) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(lessonId, questionText, JSON.stringify(options), correctIndex, explanation, orderIndex);

  const newQuestion = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(parseQuestion(newQuestion));
});

// PUT /api/questions/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found' });

  const questionText = req.body.questionText ?? existing.questionText;
  const options = req.body.options ?? JSON.parse(existing.options);
  const correctIndex = req.body.correctIndex ?? existing.correctIndex;
  const explanation = req.body.explanation ?? existing.explanation;
  const orderIndex = req.body.orderIndex ?? existing.orderIndex;

  db.prepare(
    'UPDATE questions SET questionText = ?, options = ?, correctIndex = ?, explanation = ?, orderIndex = ? WHERE id = ?'
  ).run(questionText, JSON.stringify(options), correctIndex, explanation, orderIndex, req.params.id);

  const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  res.json(parseQuestion(updated));
});

// DELETE /api/questions/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found' });
  db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;