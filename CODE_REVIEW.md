# Multi Tools

Ứng dụng web cá nhân kết hợp nhiều công cụ năng suất trong 1 nơi: **Lịch**, **Task Tracker**, và **Lessons** (ôn tập trắc nghiệm) — được xây dựng cho môn **FER202 - React**, sau đó tiếp tục phát triển thành 1 dự án cá nhân đầy đủ hơn yêu cầu đề bài gốc.

---

## 1. Mô tả dự án

Multi Tools ra đời từ nhu cầu thực tế: quản lý thời gian, công việc, và ôn tập kiến thức trong cùng 1 ứng dụng thay vì dùng nhiều app rời rạc. Ứng dụng gồm:

- **Task Tracker**: tạo, sửa, xóa nhiệm vụ; gắn độ ưu tiên (Thấp/Trung bình/Cao/Cực cao), hạn hoàn thành (có thể để trống), mô tả chi tiết; tìm kiếm và sắp xếp theo nhiều tiêu chí.
- **Lịch**: hiển thị lịch tháng, tự động đánh dấu ngày có nhiệm vụ (đổi màu khi hoàn thành), hiển thị ngày lễ Việt Nam (fetch từ API công khai), và liên kết trực tiếp với Task Tracker.
- **Lessons**: hệ thống ôn tập trắc nghiệm nhiều môn học — mỗi môn có nhiều bài học, mỗi bài học có nhiều câu hỏi (hỗ trợ cả câu hỏi 1 đáp án đúng và nhiều đáp án đúng). Có 2 chế độ: **Học** (xem câu hỏi kèm đáp án đúng ngay) và **Thi** (làm bài có chấm điểm, hỗ trợ bàn phím tắt, chế độ thứ tự/ngẫu nhiên), cùng màn hình quản lý câu hỏi (thêm/sửa/xóa) và lưới xem nhanh toàn bộ tiến trình làm bài.
- Nhiệm vụ có thể được **gắn liên kết** tới 1 bài học cụ thể trong Lessons, giúp việc học và quản lý công việc gắn kết với nhau.

---

## 2. Công nghệ sử dụng

**Frontend:**
- React (Create React App)
- React Router DOM (điều hướng SPA)
- Redux Toolkit + React Redux (quản lý state toàn cục)
- React-Bootstrap + Bootstrap 5.3 (giao diện, Dark Mode built-in)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono

**Backend:**
- Node.js + Express.js (REST API)
- SQLite qua `better-sqlite3` (cơ sở dữ liệu quan hệ, file-based)
- CORS, dotenv

**Công cụ khác:**
- Git & GitHub (quản lý phiên bản)
- Public API: [Nager.Date](https://date.nager.at/) (ngày lễ Việt Nam)

---

## 3. Hướng dẫn chạy dự án

Yêu cầu: đã cài [Node.js](https://nodejs.org/) (khuyến nghị bản LTS).

### Backend

```powershell
cd server
npm install
npm run dev
```

Server chạy tại `http://localhost:5000`. Database SQLite (`server/db/data.sqlite`) sẽ tự động được tạo ở lần chạy đầu tiên.

### Frontend

Mở terminal khác:

```powershell
cd client
npm install
npm start
```

Ứng dụng mở tại `http://localhost:3000`.

> Cần chạy **cả 2** (backend và frontend) cùng lúc để ứng dụng hoạt động đầy đủ.

---

## 4. Ánh xạ Learning Outcomes (LO1–LO8)

| LO | Yêu cầu | Triển khai trong dự án |
|---|---|---|
| **LO1** | CRA + Git (≥5 commit) | Dự án khởi tạo bằng `create-react-app`, quản lý bởi Git với lịch sử commit chi tiết theo từng tính năng (`feat(LO2): ...`, `feat(LO6): ...`...) |
| **LO2** | Component ở cả 2 dạng Class và Functional | `src/components/TaskItem/TaskItem.js` (Functional) và `TaskItemClass.js` (Class) — cùng hiển thị 1 nhiệm vụ, cùng props, khác cách viết |
| **LO3** | JSX + ES6 (arrow function, template literal, destructuring) | Dùng xuyên suốt: `.map()`/`.filter()`/`.sort()` để render danh sách động, destructuring props, template literal khi ghép chuỗi/class động |
| **LO4** | Bootstrap/React-Bootstrap + custom CSS 1 component | Toàn bộ UI dùng React-Bootstrap với Dark Mode tùy biến qua `theme.css`; custom CSS riêng cho `TaskItem`, `MonthCalendar`, `LessonDetail`... |
| **LO5** | React Router 3 route: Home `/`, Main Feature `/feature`, About `/about` | Đầy đủ 3 route bắt buộc, cộng thêm nhiều route mở rộng (`/tasks`, `/lessons`, `/lessons/:subjectId/:lessonId`...) |
| **LO6** | `useState`/`useEffect` cho tính năng tương tác + event handlers | Task Tracker (thêm/sửa/xóa/đổi trạng thái), làm bài trắc nghiệm (chọn đáp án, nộp bài, bàn phím tắt), Lịch (chuyển tháng, chọn ngày) |
| **LO7** | Fetch API công khai + loading/error state + lazy-load Main Feature | Fetch ngày lễ từ Nager.Date API tại trang Lịch (`/feature`), đủ 3 trạng thái loading/error/success; trang `/feature` nạp qua `React.lazy` + `Suspense` |
| **LO8** | Redux quản lý state toàn cục + hiển thị tóm tắt trên Navbar | Redux Toolkit (`createSlice`, `createAsyncThunk`) quản lý Tasks/Subjects/Lessons/Questions/Quiz; Navbar hiển thị badge số nhiệm vụ chưa hoàn thành, tự cập nhật theo thời gian thực |

**Điểm mở rộng (Customization & Extension) so với đề bài gốc:**
- Backend riêng (Express + SQLite) thay vì chỉ dùng state cục bộ — dữ liệu bền vững qua các lần tải lại trang.
- Module Lessons hoàn chỉnh (Subjects → Lessons → Questions), hỗ trợ câu hỏi nhiều đáp án đúng, quản lý câu hỏi qua giao diện, bàn phím tắt khi làm bài.
- Liên kết dữ liệu chéo giữa Task Tracker và Lessons.
- Thiết kế giao diện tối (dark theme) nhất quán toàn ứng dụng, có hệ thống design token riêng (màu sắc, typography).

---

## 5. Đóng góp cá nhân

- Họ tên: Trần Quốc Huy
- MSSV: DE200146
- Lớp: SE20A04
- Link GitHub: https://github.com/huytqDE200146/multi-tools
- Vai trò: thực hiện toàn bộ dự án (cá nhân) — thiết kế kiến trúc, viết code frontend/backend, tự thiết kế và nhập dữ liệu.

---

## 6. Minh bạch (Transparency)

Dự án được thực hiện với sự hỗ trợ của **Claude (Anthropic)** trong vai trò công cụ hướng dẫn: giải thích khái niệm, đề xuất cấu trúc code, và cùng rà soát lỗi trong quá trình phát triển. Toàn bộ code được người thực hiện tự tay gõ, chạy thử, và kiểm tra qua từng bước — không copy-paste nguyên khối mà không hiểu bản chất. Việc sử dụng AI hỗ trợ học tập được công khai theo đúng tinh thần minh bạch của đề bài.

---

## 7. Ghi chú thêm

- Backend đã có sẵn API đầy đủ cho **Notes** và **Events** (ngày quan trọng trên Lịch), nhưng frontend cho 2 tính năng này **chưa được xây dựng** — dự kiến phát triển tiếp trong tương lai.
- Dự án hiện chạy ở môi trường local; chưa triển khai (deploy) public.