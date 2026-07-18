const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.sqlite'));

db.pragma('foreign_keys = ON');

// ---- Bảng Tasks ----
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL DEFAULT '',
    dueDate TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// ---- Bảng Notes ----
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// ---- Bảng Calendar Events ----
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    note TEXT
  )
`);

// ---- Bảng Subjects (môn học) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ''
  )
`);

// ---- Bảng Lessons (bài học/bài tập, thuộc 1 môn học) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectId INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
  )
`);

// ---- Bảng Questions (câu hỏi trắc nghiệm, thuộc 1 bài học) ----
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lessonId INTEGER NOT NULL,
    questionText TEXT NOT NULL,
    options TEXT NOT NULL,
    correctIndexes TEXT NOT NULL,
    allowMultiple INTEGER NOT NULL DEFAULT 0,
    explanation TEXT NOT NULL DEFAULT '',
    orderIndex INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE
  )
`);

module.exports = db;