const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'db', 'data.sqlite'));

db.exec('DROP TABLE IF EXISTS questions');

console.log('Đã xóa bảng questions cũ. Chạy lại server để tạo bảng mới theo schema.');
db.close();