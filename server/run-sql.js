const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// Lấy tên file .sql từ tham số dòng lệnh, ví dụ: node run-sql.js questions.sql
const sqlFileName = process.argv[2];

if (!sqlFileName) {
  console.error('Vui lòng chỉ định file SQL cần chạy, ví dụ: node run-sql.js questions.sql');
  process.exit(1);
}

const sqlFilePath = path.join(__dirname, sqlFileName);

if (!fs.existsSync(sqlFilePath)) {
  console.error(`Không tìm thấy file: ${sqlFilePath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

const db = new Database(path.join(__dirname, 'db', 'data.sqlite'));
db.pragma('foreign_keys = ON');

db.exec(sqlContent);

console.log(`Đã chạy xong file: ${sqlFileName}`);
db.close();