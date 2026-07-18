const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Chuyển row từ DB (options, correctIndexes là chuỗi JSON) thành object JS (mảng thật)
function parseQuestion(row) {
  if (!row) return row;
  return {
    ...row,
    options: JSON.parse(row.options),
    correctIndexes: JSON.parse(row.correctIndexes),
    allowMultiple: Boolean(row.allowMultiple),
  };
}

// GET /api/questions?lessonId=1
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
    correctIndexes,
    allowMultiple = false,
    explanation = '',
    orderIndex = 0,
  } = req.body;

  if (!lessonId || !questionText || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({
      error: 'lessonId, questionText, and at least 2 options are required',
    });
  }
  if (!Array.isArray(correctIndexes) || correctIndexes.length === 0) {
    return res.status(400).json({ error: 'correctIndexes must be a non-empty array' });
  }

  const result = db
    .prepare(
      'INSERT INTO questions (lessonId, questionText, options, correctIndexes, allowMultiple, explanation, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      lessonId,
      questionText,
      JSON.stringify(options),
      JSON.stringify(correctIndexes),
      allowMultiple ? 1 : 0,
      explanation,
      orderIndex
    );

  const newQuestion = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(parseQuestion(newQuestion));
});

// PUT /api/questions/:id
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Question not found' });

  const questionText = req.body.questionText ?? existing.questionText;
  const options = req.body.options ?? JSON.parse(existing.options);
  const correctIndexes = req.body.correctIndexes ?? JSON.parse(existing.correctIndexes);
  const allowMultiple = req.body.allowMultiple ?? Boolean(existing.allowMultiple);
  const explanation = req.body.explanation ?? existing.explanation;
  const orderIndex = req.body.orderIndex ?? existing.orderIndex;

  db.prepare(
    'UPDATE questions SET questionText = ?, options = ?, correctIndexes = ?, allowMultiple = ?, explanation = ?, orderIndex = ? WHERE id = ?'
  ).run(
    questionText,
    JSON.stringify(options),
    JSON.stringify(correctIndexes),
    allowMultiple ? 1 : 0,
    explanation,
    orderIndex,
    req.params.id
  );

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