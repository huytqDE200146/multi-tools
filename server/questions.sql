-- Bộ câu hỏi mẫu cho bài "FE" (Final Exam) - môn FE FER202 (lessonId = 1)
-- Schema mới: correctIndexes là mảng JSON (vd '[1]' cho single-choice, '[0,2]' cho multi-choice)
-- allowMultiple: 0 = chỉ chọn 1 đáp án (radio), 1 = chọn nhiều đáp án (checkbox)
-- Chạy bằng lệnh: node run-sql.js questions.sql

INSERT INTO questions (lessonId, questionText, options, correctIndexes, allowMultiple, explanation, orderIndex)
VALUES
  (1, 'React là gì?',
   '["Một ngôn ngữ lập trình","Một thư viện JavaScript để xây dựng giao diện người dùng","Một hệ quản trị cơ sở dữ liệu","Một trình duyệt web"]',
   '[1]', 0,
   'React là thư viện JavaScript do Meta phát triển, tập trung vào việc xây dựng UI theo hướng component.',
   1),

  (1, 'JSX là viết tắt của cụm từ nào?',
   '["JavaScript XML","Java Syntax Extension","JSON XML","Java Style X"]',
   '[0]', 0,
   'JSX (JavaScript XML) là cú pháp mở rộng cho phép viết HTML-like bên trong JavaScript.',
   2),

  (1, 'Hook nào dùng để quản lý state trong functional component?',
   '["useEffect","useState","useContext","useRef"]',
   '[1]', 0,
   'useState là hook cơ bản nhất để khai báo và quản lý state cục bộ trong functional component.',
   3),

  (1, 'useEffect chạy lại khi nào nếu dependency array là []?',
   '["Sau mỗi lần render","Chỉ 1 lần duy nhất khi component mount","Không bao giờ chạy","Mỗi khi state thay đổi"]',
   '[1]', 0,
   'Mảng dependency rỗng [] khiến effect chỉ chạy 1 lần sau lần render đầu tiên (giống componentDidMount).',
   4),

  (1, 'Trong React Router v6, cú pháp nào đúng để định nghĩa 1 route?',
   '["<Route path=\"/\" component={Home} />","<Route path=\"/\" element={<Home />} />","<Route url=\"/\" page={Home} />","<Router path=\"/\"><Home /></Router>"]',
   '[1]', 0,
   'React Router v6 dùng prop element={<Home />} thay vì component={Home} như v5.',
   5),

  (1, 'Redux Toolkit dùng hàm nào để tạo 1 slice?',
   '["createStore","createSlice","combineReducers","createReducer"]',
   '[1]', 0,
   'createSlice là hàm chính của Redux Toolkit, gộp chung state ban đầu, actions và reducer trong 1 khai báo.',
   6),

  (1, 'Trong Redux Toolkit, createAsyncThunk tự động sinh ra bao nhiêu action type?',
   '["1 (chỉ fulfilled)","2 (pending và fulfilled)","3 (pending, fulfilled, rejected)","4 (idle, pending, fulfilled, rejected)"]',
   '[2]', 0,
   'createAsyncThunk tự động sinh 3 action type: pending (đang chạy), fulfilled (thành công), rejected (thất bại).',
   7),

  (1, 'Những hook nào sau đây thuộc thư viện react-redux? (Chọn tất cả đáp án đúng)',
   '["useSelector","useState","useDispatch","useEffect"]',
   '[0,2]', 1,
   'useSelector và useDispatch thuộc react-redux; useState và useEffect thuộc React lõi.',
   8),

  (1, 'React.lazy() thường được dùng kết hợp với thành phần nào?',
   '["Suspense","Fragment","StrictMode","Portal"]',
   '[0]', 0,
   'Suspense bắt buộc phải bọc quanh component được tạo bằng React.lazy() để hiển thị fallback UI trong lúc chờ tải code.',
   9),

  (1, 'Những mục nào sau đây là Hook có sẵn của React? (Chọn tất cả đáp án đúng)',
   '["useState","useEffect","useMemo","createSlice"]',
   '[0,1,2]', 1,
   'useState, useEffect, useMemo đều là hook có sẵn của React. createSlice thuộc Redux Toolkit, không phải hook.',
   10);