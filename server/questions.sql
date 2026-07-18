-- Bộ câu hỏi mẫu cho bài "FE" (Final Exam) - môn FE FER202 (lessonId = 1)
-- Chạy bằng lệnh: node run-sql.js questions.sql

INSERT INTO questions (lessonId, questionText, options, correctIndex, explanation, orderIndex)
VALUES
  (1, 'React là gì?',
   '["Một ngôn ngữ lập trình","Một thư viện JavaScript để xây dựng giao diện người dùng","Một hệ quản trị cơ sở dữ liệu","Một trình duyệt web"]',
   1,
   'React là thư viện JavaScript do Meta phát triển, tập trung vào việc xây dựng UI theo hướng component.',
   1),

  (1, 'JSX là viết tắt của cụm từ nào?',
   '["JavaScript XML","Java Syntax Extension","JSON XML","Java Style X"]',
   0,
   'JSX (JavaScript XML) là cú pháp mở rộng cho phép viết HTML-like bên trong JavaScript.',
   2),

  (1, 'Hook nào dùng để quản lý state trong functional component?',
   '["useEffect","useState","useContext","useRef"]',
   1,
   'useState là hook cơ bản nhất để khai báo và quản lý state cục bộ trong functional component.',
   3),

  (1, 'useEffect chạy lại khi nào nếu dependency array là []?',
   '["Sau mỗi lần render","Chỉ 1 lần duy nhất khi component mount","Không bao giờ chạy","Mỗi khi state thay đổi"]',
   1,
   'Mảng dependency rỗng [] khiến effect chỉ chạy 1 lần sau lần render đầu tiên (giống componentDidMount).',
   4),

  (1, 'Trong React Router v6, cú pháp nào đúng để định nghĩa 1 route?',
   '["<Route path=\"/\" component={Home} />","<Route path=\"/\" element={<Home />} />","<Route url=\"/\" page={Home} />","<Router path=\"/\"><Home /></Router>"]',
   1,
   'React Router v6 dùng prop element={<Home />} thay vì component={Home} như v5.',
   5),

  (1, 'Redux Toolkit dùng hàm nào để tạo 1 slice?',
   '["createStore","createSlice","combineReducers","createReducer"]',
   1,
   'createSlice là hàm chính của Redux Toolkit, gộp chung state ban đầu, actions và reducer trong 1 khai báo.',
   6),

  (1, 'Trong Redux Toolkit, createAsyncThunk tự động sinh ra bao nhiêu action type?',
   '["1 (chỉ fulfilled)","2 (pending và fulfilled)","3 (pending, fulfilled, rejected)","4 (idle, pending, fulfilled, rejected)"]',
   2,
   'createAsyncThunk tự động sinh 3 action type: pending (đang chạy), fulfilled (thành công), rejected (thất bại).',
   7),

  (1, 'Vì sao cần prop "key" khi render danh sách bằng .map()?',
   '["Để tăng tốc độ tải trang","Giúp React nhận diện phần tử nào thay đổi/thêm/xóa, tối ưu re-render","Bắt buộc để code chạy được, không có ý nghĩa khác","Dùng để style CSS riêng cho từng phần tử"]',
   1,
   'React dùng key để so sánh (diffing) giữa các lần render, tránh render lại toàn bộ danh sách không cần thiết.',
   8),

  (1, 'React.lazy() thường được dùng kết hợp với thành phần nào?',
   '["Suspense","Fragment","StrictMode","Portal"]',
   0,
   'Suspense bắt buộc phải bọc quanh component được tạo bằng React.lazy() để hiển thị fallback UI trong lúc chờ tải code.',
   9),

  (1, 'useSelector và useDispatch là 2 hook thuộc thư viện nào?',
   '["react-router-dom","react-redux","@reduxjs/toolkit","react-dom"]',
   1,
   'useSelector và useDispatch được cung cấp bởi react-redux, dùng để đọc và gửi action tới Redux store.',
   10);