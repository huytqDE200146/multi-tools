const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tasksRouter = require('./routes/tasks');
const notesRouter = require('./routes/notes');
const eventsRouter = require('./routes/events');
const subjectsRouter = require('./routes/subjects');
const lessonsRouter = require('./routes/lessons');
const questionsRouter = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/question-images', express.static('public/question-images'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Multi Tools API is running' });
});

app.use('/api/tasks', tasksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/questions', questionsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Multi Tools server đang chạy tại http://localhost:${PORT}`);
});