const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/events - lấy toàn bộ, hoặc lọc theo ?month=YYYY-MM
router.get('/', (req, res) => {
  const { month } = req.query;
  let events;
  if (month) {
    events = db.prepare("SELECT * FROM events WHERE date LIKE ? ORDER BY date").all(`${month}%`);
  } else {
    events = db.prepare('SELECT * FROM events ORDER BY date').all();
  }
  res.json(events);
});

router.post('/', (req, res) => {
  const { date, title, note = '' } = req.body;
  if (!date || !title || !title.trim()) {
    return res.status(400).json({ error: 'date and title are required' });
  }
  const result = db
    .prepare('INSERT INTO events (date, title, note) VALUES (?, ?, ?)')
    .run(date, title.trim(), note);
  const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newEvent);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const date = req.body.date ?? existing.date;
  const title = req.body.title ?? existing.title;
  const note = req.body.note ?? existing.note;

  db.prepare('UPDATE events SET date = ?, title = ?, note = ? WHERE id = ?').run(
    date,
    title,
    note,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });
  db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;