const Database = require('better-sqlite3');
const path = require('path');

// File database sẽ được tạo tại server/db/data.sqlite
const db = new Database(path.join(__dirname, 'data.sqlite'));

// Bật kiểm tra khóa ngoại
db.pragma('foreign_keys = ON');

// ---- Bảng Tasks ----
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo',
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

module.exports = db;