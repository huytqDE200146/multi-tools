# Code Review Chi Tiết — Dự án Multi Tools

> Review từng file mã nguồn (`.js`), không bao gồm `.css`. Sắp xếp theo cấu trúc thư mục thật của dự án.

---

## PHẦN A — SERVER (`server/`)

### `server/db/database.js`

**Mục đích:** Điểm kết nối SQLite duy nhất của toàn app, dùng chung bởi mọi file route.

**Nội dung chính:**
- `new Database(path.join(__dirname, 'data.sqlite'))` — mở (hoặc tự tạo) file database tại `server/db/data.sqlite`.
- `db.pragma('foreign_keys = ON')` — bật ràng buộc khóa ngoại (mặc định SQLite tắt tính năng này).
- 6 khối `db.exec(CREATE TABLE IF NOT EXISTS ...)` định nghĩa schema: `tasks`, `notes`, `events`, `subjects`, `lessons`, `questions`.
  - `tasks`: có `priority`, `description`, `dueDate` (nullable), `relatedLessonId` (nullable, thêm sau qua migration).
  - `lessons`: có `FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE`.
  - `questions`: có `FOREIGN KEY (lessonId) ... ON DELETE CASCADE`, cột `options`/`correctIndexes` là `TEXT` (lưu JSON dạng chuỗi), `allowMultiple` là `INTEGER` (quy ước 0/1 thay cho boolean vì SQLite không có kiểu boolean thật).
- 2 khối `try { db.exec('ALTER TABLE ... ADD COLUMN ...') } catch (e) {}` — migration thủ công cho 2 cột thêm sau (`imageUrl` ở `questions`, `relatedLessonId` ở `tasks`). Bọc `try/catch` vì `ALTER TABLE ADD COLUMN` báo lỗi nếu chạy lại lần 2 (cột đã tồn tại) — mỗi lần server khởi động lại đều chạy qua đoạn này.
- `module.exports = db` — export instance database để mọi route `require()` dùng chung 1 kết nối.

**Ghi chú:** Cách migrate bằng `try/catch` hoạt động ổn cho dự án cá nhân, nhưng là "vết nợ kỹ thuật" nếu mở rộng — nên chuyển sang thư viện migration chuyên dụng nếu dự án lớn hơn.

---

### `server/routes/tasks.js`

**Mục đích:** REST API đầy đủ CRUD cho nhiệm vụ (`/api/tasks`).

**Nội dung chính:**
- `GET /` — `SELECT * FROM tasks ORDER BY createdAt DESC`, trả toàn bộ task, mới nhất trước.
- `GET /:id` — lấy 1 task theo id, trả `404` nếu không tồn tại.
- `POST /` — destructuring `{ title, status = 'todo', priority = 'medium', description = '', dueDate = null, relatedLessonId = null }` từ `req.body`, có giá trị mặc định cho mọi field trừ `title`. Validate `title` không rỗng trước khi insert. Dùng `db.prepare(...).run(...)` (parameterized query, tránh SQL injection), rồi query lại bản ghi vừa tạo bằng `result.lastInsertRowid` để trả về đầy đủ (bao gồm `id`, `createdAt` do SQLite tự sinh).
- `PUT /:id` — pattern `req.body.xxx ?? existing.xxx` cho từng field: nếu client không gửi field đó thì giữ nguyên giá trị cũ (cập nhật từng phần, không bắt buộc gửi toàn bộ object).
- `DELETE /:id` — kiểm tra tồn tại trước khi xóa, trả `204 No Content` khi thành công.

**Ghi chú:** Không có gì bất thường, đúng chuẩn REST, code sạch.

---

### `server/routes/notes.js`

**Mục đích:** CRUD cho Notes (`/api/notes`) — cấu trúc **giống hệt** `tasks.js` nhưng field đơn giản hơn (`title`, `content`), có thêm `updatedAt` tự cập nhật bằng `datetime('now')` mỗi lần `PUT`.

**Ghi chú quan trọng:** Route này hoạt động đầy đủ và đã test qua Postman/PowerShell lúc đầu dự án, nhưng **frontend chưa từng gọi tới các endpoint này** — không có trang Notes nào được xây. Đây là phần backend "chờ sẵn" nhưng chưa dùng.

---

### `server/routes/events.js`

**Mục đích:** CRUD cho "sự kiện lịch" (`/api/events`) — dùng để lưu ngày quan trọng người dùng tự đánh dấu trên Lịch.

**Nội dung chính:**
- `GET /` hỗ trợ query `?month=YYYY-MM`, dùng `LIKE ?` với tham số `${month}%` để lọc sự kiện theo tháng.
- Các route còn lại (POST/PUT/DELETE) tương tự `tasks.js`.

**Ghi chú quan trọng:** Giống `notes.js` — route hoạt động tốt nhưng **chưa được frontend sử dụng**. Trang Lịch hiện tại (`Feature.js`) chỉ hiển thị chấm đánh dấu dựa trên `dueDate` của `tasks`, không đọc bảng `events` này.

---

### `server/routes/subjects.js`

**Mục đích:** CRUD môn học (`/api/subjects`). Cấu trúc đơn giản, y hệt pattern chuẩn: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`. Field: `name`, `description`.

---

### `server/routes/lessons.js`

**Mục đích:** CRUD bài học (`/api/lessons`), luôn thuộc về 1 `subjectId`.

**Điểm khác biệt so với `subjects.js`:**
- `GET /` hỗ trợ `?subjectId=` để lọc bài học theo môn — nếu không truyền, trả về **toàn bộ** bài học của mọi môn (dùng ở `TaskDetail.js` để build dropdown "Bài học liên quan").
- `POST /` bắt buộc cả `subjectId` và `title`.
- Nhờ `ON DELETE CASCADE` ở schema, `DELETE /:id` tự động kéo theo xóa mọi `questions` thuộc lesson đó mà route không cần tự viết logic xóa thủ công.

---

### `server/routes/questions.js`

**Mục đích:** CRUD câu hỏi trắc nghiệm — file phức tạp nhất trong các route vì phải xử lý dữ liệu dạng mảng lưu trong cột TEXT.

**Nội dung chính:**
- Hàm phụ trợ `parseQuestion(row)`: chuyển `options` và `correctIndexes` từ chuỗi JSON (lưu trong SQLite) sang mảng JS thật bằng `JSON.parse()`, và `allowMultiple` từ `0/1` sang `true/false` bằng `Boolean(...)`. Hàm này được gọi lại ở **mọi** route trả về câu hỏi (GET list, GET one, POST, PUT) để tránh lặp code.
- `GET /` hỗ trợ `?lessonId=`, sắp theo `orderIndex, id`.
- `POST /` validate khá chặt: `Array.isArray(options) && options.length >= 2`, và `Array.isArray(correctIndexes) && correctIndexes.length > 0`, kèm kiểm tra mọi giá trị trong `correctIndexes` phải nằm trong phạm vi hợp lệ của `options`. Khi ghi vào DB, `JSON.stringify(options)` và `JSON.stringify(correctIndexes)` để lưu dạng chuỗi.
- `PUT /:id` — nếu client không gửi `options`/`correctIndexes` mới, phải tự `JSON.parse(existing.options)` trước khi dùng làm giá trị fallback (vì `existing` lấy thẳng từ DB là chuỗi thô, chưa qua `parseQuestion`).

**Ghi chú:** Đây là route có logic phức tạp nhất backend, nhưng được viết nhất quán, không có lỗ hổng rõ rệt.

---

### `server/server.js`

**Mục đích:** Điểm khởi động Express, nơi "lắp ráp" mọi route lại với nhau.

**Nội dung chính:**
- `app.use(cors())` — cho phép mọi origin gọi API (⚠️ cần siết lại nếu deploy public thật).
- `app.use(express.json())` — middleware parse JSON body.
- `app.use('/question-images', express.static('public/question-images'))` — biến thư mục ảnh thành URL tĩnh truy cập trực tiếp.
- `app.get('/api/health', ...)` — endpoint kiểm tra nhanh server còn sống.
- 6 dòng `app.use('/api/xxx', xxxRouter)` gắn tiền tố cho từng router con.
- Middleware bắt-tất-cả cuối file (không có `path`) trả `404` cho route không khớp.
- `app.listen(PORT, ...)` — `PORT` ưu tiên lấy từ biến môi trường (`process.env.PORT`), fallback về `5000`.

---

### `server/run-sql.js`

**Mục đích:** Công cụ dòng lệnh tổng quát — chạy bất kỳ file `.sql` nào vào database, dùng để nạp dữ liệu mẫu mà không cần viết script riêng mỗi lần.

**Nội dung chính:**
- `process.argv[2]` — lấy tên file `.sql` từ tham số dòng lệnh (`node run-sql.js <tên_file>.sql`).
- Kiểm tra file tồn tại bằng `fs.existsSync`, thoát với thông báo lỗi nếu không thấy.
- `fs.readFileSync(sqlFilePath, 'utf8')` đọc toàn bộ nội dung, rồi `db.exec(sqlContent)` chạy hết (SQLite cho phép nhiều câu lệnh cách nhau dấu `;` trong 1 lần gọi `exec`).

---

### `server/seed-swt.js`

**Mục đích:** Script 1 lần dùng để nạp 337 câu hỏi môn SWT301 (được parse từ file Word gốc bên ngoài, không phải viết tay).

**Nội dung chính:**
- Tự kiểm tra Lesson "FE" đã tồn tại trong `subjectId = 4` chưa (`SELECT ... WHERE subjectId = ? AND title = ?`) — nếu chưa, tự tạo mới; nếu có rồi, dùng lại (tránh tạo trùng khi chạy script nhiều lần).
- Toàn bộ 337 câu hỏi được **nhúng thẳng dưới dạng mảng JS literal** trong file (không tách file JSON riêng) — quyết định này nhằm giảm số file cần bạn tự tay tải/copy khi setup (chỉ 1 file duy nhất).
- Dùng `db.transaction((items) => {...})` bọc vòng lặp insert — đảm bảo toàn bộ 337 dòng insert thành công cùng lúc hoặc rollback toàn bộ nếu có lỗi giữa chừng, đồng thời nhanh hơn insert từng dòng riêng lẻ.

**Ghi chú:** File này không thuộc luồng chạy chính của app — chỉ chạy 1 lần thủ công khi cần nạp dữ liệu, có thể xóa sau khi đã dùng xong (nhưng giữ lại trong repo cũng không hại gì, coi như "tài liệu nạp dữ liệu mẫu").

---

## PHẦN B — CLIENT: Nền tảng (`client/src/`)

### `src/index.js`

**Mục đích:** Điểm vào của toàn bộ ứng dụng React.

**Nội dung chính:** `ReactDOM.createRoot(...).render(...)` render `<App />`, bọc trong `<React.StrictMode>` (cảnh báo phát triển của React, tự động tắt ở bản production) và `<Provider store={store}>` (react-redux) — đây là bước bắt buộc để mọi component con trong `<App />` truy cập được Redux store mà không cần truyền props thủ công qua nhiều tầng.

---

### `src/App.js`

**Mục đích:** Khai báo toàn bộ cấu trúc điều hướng (routing) của app.

**Nội dung chính:**
- `const Feature = lazy(() => import('./pages/Feature/Feature'))` — dynamic import, Webpack tách code trang Lịch thành 1 file JS riêng, chỉ tải khi người dùng vào `/feature` (đáp ứng LO7).
- Bọc route `/feature` trong `<Suspense fallback={...}>` — bắt buộc phải có khi dùng `React.lazy`, hiện Spinner trong lúc chờ tải code.
- Danh sách đầy đủ `<Route>`: `/`, `/feature`, `/tasks`, `/tasks/:id`, `/lessons`, `/lessons/:subjectId`, `/lessons/:subjectId/:lessonId/study`, `/lessons/:subjectId/:lessonId`, `/lessons/:subjectId/:lessonId/review`, `/about`.
- Toàn bộ bọc trong `<div data-bs-theme="dark">` — kích hoạt Bootstrap 5.3 Dark Mode cho mọi component con.
- `<AppNavbar />` đặt ngoài `<Routes>` — luôn hiển thị ở mọi trang, không bị thay đổi theo route.

---

### `src/app/store.js`

**Mục đích:** Cấu hình Redux store trung tâm.

**Nội dung chính:** `configureStore({ reducer: { tasks, subjects, lessons, questions, quiz } })` — gộp 5 slice reducer lại thành 1 store duy nhất. Mỗi slice quản lý 1 "khoang" riêng trong state tổng (`state.tasks`, `state.subjects`...).

---

### `src/api/tasksApi.js`

**Mục đích:** Lớp gọi HTTP thuần cho Tasks, tách biệt hoàn toàn khỏi Redux.

**Nội dung chính:** 4 hàm `async function`: `fetchTasksApi`, `createTaskApi`, `updateTaskApi`, `deleteTaskApi` — mỗi hàm gọi `fetch(...)` với đúng method (GET/POST/PUT/DELETE), kiểm tra `res.ok` và `throw new Error(...)` nếu request thất bại, trả `res.json()` nếu thành công. `deleteTaskApi` trả về `id` (không phải response body, vì server trả `204 No Content` không có body) — giá trị này dùng ở reducer để biết cần xóa phần tử nào khỏi state.

**Ghi chú:** `API_URL` đọc từ `process.env.REACT_APP_API_URL`, có fallback `http://localhost:5000/api` nếu biến môi trường chưa cấu hình.

---

### `src/api/subjectsApi.js`, `src/api/lessonsApi.js`, `src/api/questionsApi.js`

**Mục đích:** Cùng pattern với `tasksApi.js`, chỉ khác endpoint và field dữ liệu.

**Điểm khác biệt đáng chú ý:**
- `lessonsApi.js` có thêm `fetchAllLessonsApi()` (không lọc theo subject) — dùng riêng cho dropdown "Bài học liên quan" ở `TaskDetail.js`.
- `questionsApi.js` có đủ `createQuestionApi`, `updateQuestionApi`, `deleteQuestionApi` (thêm sau, khi xây tính năng Quản lý câu hỏi trong `ReviewGrid.js`) bên cạnh `fetchQuestionsByLessonApi` ban đầu.

---

### `src/features/tasks/tasksSlice.js`

**Mục đích:** Redux slice quản lý state Tasks, đồng bộ 2 chiều với backend.

**Nội dung chính:**
- 5 `createAsyncThunk`: `fetchTasks`, `addTask`, `updateTask`, `deleteTask`, `toggleTaskStatus` — mỗi thunk gọi 1 hàm tương ứng từ `tasksApi.js` bên trong, tự động sinh 3 action type (`pending`/`fulfilled`/`rejected`).
- `toggleTaskStatus` nhận **nguyên object `task`** (không chỉ `id`) — vì cần tự tính trạng thái kế tiếp (`todo → in-progress → done → todo`) ngay tại client trước khi gửi PUT lên server (server không có logic "xoay vòng" này).
- `initialState = { items: [], loading: false, error: null }` — không còn dữ liệu mock cứng như phiên bản đầu dự án.
- `reducers: {}` (rỗng) vì không còn action đồng bộ nào — mọi thay đổi đều qua thunk (bất đồng bộ).
- `extraReducers` xử lý 3 trạng thái của `fetchTasks` (loading/error/success chuẩn) và `.fulfilled` của 4 thunk còn lại: `addTask` dùng `state.items.unshift(...)` (thêm đầu mảng), `updateTask`/`toggleTaskStatus` dùng `findIndex` rồi gán đè `state.items[idx] = action.payload`, `deleteTask` dùng `.filter(...)`.

---

### `src/features/subjects/subjectsSlice.js`, `src/features/lessons/lessonsSlice.js`, `src/features/questions/questionsSlice.js`

**Mục đích:** Cùng khuôn mẫu với `tasksSlice.js` — fetch/add/update/delete qua `createAsyncThunk`, `extraReducers` xử lý pending/fulfilled/rejected.

**Điểm khác biệt:**
- `lessonsSlice`: thunk `fetchLessonsBySubject` nhận tham số `subjectId`, mỗi lần gọi **thay thế hoàn toàn** `state.items` — nghĩa là chỉ giữ dữ liệu của 1 môn học tại 1 thời điểm, không cache nhiều môn cùng lúc.
- `questionsSlice`: không có `updateSubject`-kiểu gì đặc biệt, nhưng có đủ 4 thunk `fetchQuestionsByLesson`, `addQuestion`, `updateQuestion`, `deleteQuestion` (thêm sau khi xây form Quản lý câu hỏi).

---

### `src/features/quiz/quizSlice.js`

**Mục đích:** Slice **không gọi API** — chỉ lưu tiến trình làm quiz tạm thời trong Redux (mất khi F5, đây là quyết định thiết kế có chủ đích vì tiến trình làm bài không cần bền vững như dữ liệu Task/Lesson).

**Nội dung chính:**
- `initialState = { answers: {} }` — cấu trúc lồng `answers[lessonId][questionId] = { selected: [], submitted: false, isCorrect: false }`.
- 2 hàm phụ trợ `getOrCreateLessonAnswers`, `getOrCreateQuestionAnswer` — tự tạo object con nếu chưa tồn tại, tránh lặp code kiểm tra "if not exists" ở mỗi reducer.
- `toggleOption`: nếu `answer.submitted === true`, `return` ngay (khóa chỉnh sửa sau khi đã nộp). Nếu `allowMultiple`, hành vi giống checkbox (`push`/`splice` để thêm/bớt khỏi mảng `selected`); nếu không, hành vi giống radio (`selected = [optionIndex]`, luôn thay thế).
- `submitAnswer`: so sánh 2 mảng đã `.sort()` (so `selectedSorted.length === correctSorted.length` và `.every((val, idx) => val === correctSorted[idx])`) để tính đúng/sai, không phụ thuộc thứ tự người dùng bấm chọn.
- `resetLessonAnswers`: `delete state.answers[lessonId]` — xóa sạch tiến trình 1 bài học.

---

### `src/constants/priority.js`

**Mục đích:** 3 object tra cứu (lookup table) dùng chung nhiều nơi: `PRIORITY_ORDER` (số, dùng để sort), `PRIORITY_LABELS` (nhãn tiếng Việt), `PRIORITY_COLORS` (màu Bootstrap). Không có logic, chỉ là dữ liệu tĩnh export ra.

---

### `src/utils/formatDate.js`

**Mục đích:** 1 hàm duy nhất `formatDateDisplay(isoDate)` — tách chuỗi `"YYYY-MM-DD"` bằng `.split('-')`, ghép lại thành `"DD/MM/YYYY"`. Có early-return `''` nếu input rỗng/null. Chỉ ảnh hưởng **hiển thị**, không đổi định dạng lưu trữ/so sánh trong toàn bộ phần còn lại của app.

---

## PHẦN C — CLIENT: Components dùng chung

### `src/components/Navbar/AppNavbar.js`

**Mục đích:** Thanh điều hướng cố định ở mọi trang.

**Nội dung chính:** `useSelector((state) => state.tasks.items)` đọc trực tiếp Redux để tính `pendingCount` (số task chưa `done`) hiển thị badge cạnh link "Nhiệm vụ" — đây là ví dụ điển hình về lý do cần Redux: `AppNavbar` không nằm trong cây component của trang Tasks, nhưng vẫn cần biết số liệu đó. Dùng `NavLink` (không phải `Link`) cho các mục điều hướng vì cần tự động nhận diện link đang active để tô màu/gạch chân.

---

### `src/components/TaskItem/TaskItem.js`

**Mục đích:** Component hiển thị 1 task, dạng Functional (đáp ứng LO2).

**Nội dung chính:** Nhận props `task`, `onToggleStatus`, `onDelete` (2 callback cuối là **optional** — không truyền thì không hiện nút tương ứng, cho phép tái sử dụng ở nơi chỉ cần "xem" như trang Lịch). Destructuring `{ title, status, dueDate, priority }` ngay tham số. Tính `statusVariant`/`statusLabel` bằng ternary lồng nhau. Tiêu đề bọc trong `<Link to={/tasks/${id}}>` để bấm vào điều hướng sang trang chi tiết.

---

### `src/components/TaskItem/TaskItemClass.js`

**Mục đích:** Bản Class Component của `TaskItem`, cùng chức năng/giao diện hệt bản Functional — viết ra để đáp ứng yêu cầu học thuật (LO2: "cả 2 dạng Class và Functional").

**Nội dung chính:** `class TaskItemClass extends React.Component`, dùng `this.props` để truy cập dữ liệu (khác Functional destructure thẳng ở tham số), có 2 method riêng (`getStatusVariant()`, `getStatusLabel()`) thay cho biến `const` cục bộ, bắt buộc có method `render()` trả JSX.

**Ghi chú:** Component này **hiện không được import/dùng ở bất kỳ trang nào** trong luồng chính của app (`TaskList.js` chỉ dùng bản Functional) — tồn tại thuần túy để minh họa, không phải code sản xuất thật sự chạy.

---

### `src/components/TaskList/TaskList.js`

**Mục đích:** Bọc logic `.map()` render nhiều `TaskItem`, tách khỏi trang để tái sử dụng (Home/Tasks/Feature đều dùng lại).

**Nội dung chính:** Arrow function component, có early-return hiện `<p>Chưa có nhiệm vụ nào.</p>` nếu mảng `tasks` rỗng, không thì `.map()` ra danh sách `<TaskItem key={task.id} ... />`. Truyền xuyên suốt `onToggleStatus`/`onDelete` từ props cha xuống từng `TaskItem`.

---

### `src/components/StatsSummary/StatsSummary.js`

**Mục đích:** Khối thống kê "Xin chào, {userName}!" ở đầu trang Home.

**Nội dung chính:** Tính 4 số liệu (`total`, `done`, `inProgress`, `todo`) bằng `.filter().length`, và `completionRate` bằng phép chia có xử lý trường hợp `total === 0` (tránh chia cho 0 ra `NaN`). Hiển thị mỗi số liệu với `font-mono` và 1 màu riêng theo `theme.css`.

---

### `src/components/Calendar/MonthCalendar.js`

**Mục đích:** Component lưới lịch tháng, tái sử dụng (chỉ dùng ở `Feature.js` nhưng viết tách riêng để có thể tái sử dụng nếu cần).

**Nội dung chính:**
- Hàm nội bộ `getMonthMatrix(year, month)` — tự tính số ngày trong tháng bằng `new Date(year, month + 1, 0).getDate()` (thủ thuật: ngày 0 của tháng sau = ngày cuối tháng này), bù ô trống đầu/cuối để mỗi tuần đủ 7 cột.
- `(firstDay.getDay() + 6) % 7` — quy đổi từ chuẩn JS (Chủ Nhật=0) sang chuẩn hiển thị Việt Nam (Thứ Hai=0).
- Export `formatDateKey(year, month, day)` — dùng chung với `Feature.js` để tạo chuỗi `"YYYY-MM-DD"` khớp định dạng `task.dueDate`.
- `getTasksOfDay`/`getDayDotClass`: lọc task theo ngày, dùng `.every((t) => t.status === 'done')` để quyết định chấm đánh dấu màu xanh lá (mọi task đã xong) hay xanh dương (còn task chưa xong).
- Click vào ô ngày gọi `onSelectDay(formatDateKey(...))` — component này **không tự điều hướng**, chỉ gọi callback, để component cha (`Feature.js`) quyết định làm gì tiếp.

---

## PHẦN D — CLIENT: Pages

### `src/pages/Home/Home.js`

**Mục đích:** Trang chủ (`/`).

**Nội dung chính:** `useEffect(() => { dispatch(fetchTasks()) }, [dispatch])` — tự fetch dữ liệu khi mount (vì Home có thể là trang đầu tiên người dùng vào, không thể trông chờ trang khác đã fetch hộ). Render `<StatsSummary>` + `<TaskList>`, có xử lý `loading`/`error` bằng Spinner/Alert trước khi hiện danh sách.

---

### `src/pages/Tasks/Tasks.js`

**Mục đích:** Trang danh sách nhiệm vụ đầy đủ (`/tasks`), có form thêm, tìm kiếm, sắp xếp.

**Nội dung chính:**
- Form thêm task: 3 input (tên, hạn — optional, độ ưu tiên qua `Form.Select`), dispatch `addTask` khi submit (không tự tạo `id` — để SQLite `AUTOINCREMENT` tự sinh).
- `visibleTasks = useMemo(() => {...}, [tasks, sortBy, searchTerm])` — chuỗi `.filter()` (tìm theo tên, không phân biệt hoa/thường qua `.toLowerCase()`) rồi `.sort()` theo 1 trong 4 tiêu chí (`switch (sortBy)`), copy mảng bằng `[...filtered]` trước khi sort để tránh mutate mảng gốc từ Redux.
- Sort theo `priority` dùng `PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]` (giảm dần, ưu tiên cao lên đầu); sort theo `date` xử lý riêng trường hợp `dueDate === null` (đẩy xuống cuối bất kể sort tăng/giảm).

---

### `src/pages/TaskDetail/TaskDetail.js`

**Mục đích:** Trang chi tiết 1 task (`/tasks/:id`) — xem/sửa mô tả, liên kết tới Lesson.

**Nội dung chính:**
- `useParams()` lấy `id` (string) từ URL; `useSelector` tìm task bằng `String(t.id) === id` (ép kiểu vì `id` trong Redux là number, còn `id` từ URL luôn là string).
- Early-return hiện `<Alert>` "Không tìm thấy nhiệm vụ" nếu `task` là `undefined` (task đã bị xóa hoặc URL sai).
- 2 `useEffect` riêng biệt: 1 để tải toàn bộ `lessons` + `subjects` (dùng API trực tiếp, không qua Redux, vì dữ liệu này chỉ dùng cục bộ trong trang), 1 để đồng bộ state `description` với dữ liệu thật mỗi khi `task` đổi.
- Dropdown "Bài học liên quan": chọn xong **tự động dispatch** `updateTask` ngay (khác phần mô tả cần bấm nút "Lưu" riêng) — lưu `relatedLessonId` là `Number(value)` hoặc `null` nếu chọn "Không liên kết".
- `getLessonLabel(lesson)` — tra chéo `subjectId` của lesson sang tên môn học thật để hiển thị dạng "Tên môn - Tên bài học" trong dropdown.

---

### `src/pages/Feature/Feature.js`

**Mục đích:** Trang "Lịch" (`/feature`), nạp lazy — tích hợp nhiều nguồn dữ liệu: Redux (tasks), API ngoài (ngày lễ), và state cục bộ (tháng đang xem, ngày đang chọn).

**Nội dung chính:**
- `useEffect` riêng gọi `fetch('https://date.nager.at/api/v4/Holidays/VN/2026')` trực tiếp bằng `fetch` gốc (không qua `api/` layer vì đây là API bên thứ 3, không phải backend riêng) — có đủ 3 state `loadingHolidays`/`errorHolidays`/`holidays`, `try/catch/finally` chuẩn.
- `goToPrevMonth`/`goToNextMonth`: `new Date(prev.getFullYear(), prev.getMonth() ± 1, 1)` — JS tự xử lý tràn năm khi tháng vượt khỏi khoảng 0-11 (không cần code thủ công if/else).
- `extremeTasks`, `upcomingTasks`, `noDeadlineTasks`: 3 khối `useMemo` lọc/sort task theo tiêu chí riêng (ưu tiên cực cao chưa xong / 3 task gần hạn nhất / 3 task chưa có hạn).
- `selectedDate` (state): khi có giá trị, component **early-return** hẳn 1 nhánh JSX khác (xem task theo ngày cụ thể) thay vì hiện bảng lịch — không đổi route, chỉ đổi UI nội bộ.

---

### `src/pages/Lessons/Lessons.js`

**Mục đích:** Trang danh sách môn học (`/lessons`), có thêm/sửa/xóa.

**Nội dung chính:** Pattern "inline edit" — 1 state `editingId` dùng chung cho toàn danh sách: card nào có `subject.id === editingId` thì tự đổi UI thành form sửa (`Form.Control` cho tên/mô tả + nút Lưu/Hủy), card khác giữ nguyên hiển thị bình thường. `startEditing` copy dữ liệu hiện tại vào state tạm (`editName`, `editDescription`) trước khi hiện form; `saveEditing` dispatch `updateSubject` rồi thoát chế độ sửa ngay (không đợi kết quả API).

---

### `src/pages/SubjectDetail/SubjectDetail.js`

**Mục đích:** Trang danh sách bài học trong 1 môn (`/lessons/:subjectId`), có Học/Thi/Sửa/Xóa.

**Nội dung chính:** Cùng pattern inline-edit như `Lessons.js` (áp dụng cho `lesson.title`/`description` thay vì `subject.name`). Tự fetch riêng thông tin `subject` hiện tại bằng gọi thẳng `fetchSubjectByIdApi` (không qua Redux) để lấy tên môn hiển thị tiêu đề trang — dùng `.then()/.catch()` thay vì `async/await` (minh họa cách viết Promise khác).

---

### `src/pages/LessonDetail/LessonDetail.js`

**Mục đích:** Trang "Thi" — làm bài trắc nghiệm tương tác đầy đủ. File phức tạp nhất trong toàn bộ frontend.

**Nội dung chính:**
- `shuffleArray(array)` — thuật toán Fisher-Yates chuẩn, xáo mảng đều ngẫu nhiên, trả mảng mới (copy bằng `[...array]` trước khi xáo).
- `displayOrder` (state): mảng index trỏ vào `questions` gốc, tách biệt "thứ tự hiển thị" khỏi "thứ tự dữ liệu" — cho phép chế độ Ngẫu nhiên mà không cần xáo trộn dữ liệu Redux thật.
- `prevModeRef = useRef(mode)` — dùng để phân biệt effect chạy vì `mode` thực sự đổi (người bấm nút) hay vì lý do khác (`questions.length` đổi khi tải xong lần đầu), tránh vô tình ghi đè `?q=` trên URL khi mount lại từ ReviewGrid (đây từng là 1 bug đã fix).
- Bàn phím: 1 `useEffect` duy nhất gắn `window.addEventListener('keydown', ...)`, có return cleanup function gỡ listener — xử lý phím chữ A-F, số 1-6 (`Number(e.key) - 1`), Enter (submit hoặc next tùy `answer.submitted`), mũi tên trái/phải.
- `getOptionState(optionIndex)` — hàm tính 1 trong 4 trạng thái màu cho mỗi đáp án sau khi nộp (`correct`/`missed`/`wrong`/`default`) dựa vào so sánh `correctIndexes` và `selected`.
- `handleReset` — `window.confirm(...)` rồi `dispatch(resetLessonAnswers(lessonId))` + quay về câu 1.
- Early-return khi `!currentQuestion` (khoảng thời gian ngắn giữa lúc `questions` tải xong và `displayOrder` chưa kịp tính) — tránh lỗi truy cập `undefined.questionText`.

---

### `src/pages/StudyMode/StudyMode.js`

**Mục đích:** Trang "Học" — xem câu hỏi + đáp án đúng ngay, không cần tương tác chọn.

**Nội dung chính:** Đơn giản hơn nhiều so với `LessonDetail.js` — không dùng `quizSlice` (không có khái niệm "đã trả lời" ở đây). Đáp án render bằng `<div>` tĩnh (không phải `<button>`, vì không cần bắt sự kiện click), tô sẵn màu xanh (`lesson-option-correct`) và nhãn "✓ Đáp án đúng" cho đáp án đúng dựa thẳng vào `correctIndexes`, không cần logic "submit" gì cả. Bàn phím chỉ có mũi tên trái/phải để chuyển câu.

---

### `src/pages/ReviewGrid/ReviewGrid.js`

**Mục đích:** 2 chức năng gộp trong 1 trang — xem nhanh toàn bộ câu hỏi dạng lưới, **và** quản lý câu hỏi (CRUD).

**Nội dung chính:**
- `manageMode` (state boolean) quyết định nhánh JSX nào được render — toàn bộ phần dưới UI khác nhau hoàn toàn tùy giá trị này.
- `toggleManageMode`: khi **bật**, `window.confirm(...)` cảnh báo mất tiến trình → nếu đồng ý, `dispatch(resetLessonAnswers(lessonId))` trước khi bật `manageMode = true` (đảm bảo không có dữ liệu "đúng/sai" bị lệch nếu người dùng vừa sửa đáp án đúng của 1 câu đã lỡ làm).
- Chế độ xem (mặc định): `getCellState(questionId)` tra `answersForLesson[questionId]` để quyết định màu ô (`correct`/`wrong`/`unanswered`), `handleJumpToQuestion(index)` dùng `useNavigate()` điều hướng thẳng tới `/lessons/:subjectId/:lessonId?q=<index>`.
- Chế độ quản lý: form thêm/sửa câu hỏi với mảng `options` động (2-6 phần tử qua `addOptionField`/`removeOptionField`), tick checkbox để đánh dấu đáp án đúng (`toggleCorrect`) — `allowMultiple` được **tự suy ra** từ `form.correctIndexes.length > 1`, không cần checkbox riêng.
- `removeOptionField(idx)` — phần logic dễ sai nhất: khi xóa 1 đáp án ở giữa, phải dịch lùi mọi index trong `correctIndexes` đứng sau vị trí đó 1 đơn vị (`.map((ci) => (ci > idx ? ci - 1 : ci))`), đồng thời loại bỏ index đó nếu chính nó đang là đáp án đúng.

---

### `src/pages/About/About.js`

**Mục đích:** Trang giới thiệu tĩnh (`/about`). Không có state, không có logic — chỉ render nội dung tĩnh trong `<Card accent-card accent-primary>`.

---

## Tổng kết nhanh: các pattern lặp lại xuyên suốt dự án

1. **API layer tách biệt Redux** (`api/*.js` chỉ gọi `fetch`, không biết gì về Redux) — mọi domain đều theo cấu trúc này.
2. **`createAsyncThunk` + `extraReducers`** — khuôn mẫu chuẩn cho mọi slice có gọi API (tasks/subjects/lessons/questions), riêng `quiz` là ngoại lệ (chỉ có reducer đồng bộ, không gọi API).
3. **`useMemo` cho filter/sort tốn kém** — dùng ở `Tasks.js`, `Feature.js` để tránh tính lại không cần thiết.
4. **Inline-edit bằng 1 state `editingId` dùng chung cho cả danh sách** — lặp lại ở `Lessons.js` và `SubjectDetail.js`.
5. **`window.confirm` trước hành động phá hủy dữ liệu** — dùng ở nút Reset và khi bật chế độ Quản lý câu hỏi.