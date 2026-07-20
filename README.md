# Multi Tools

Ứng dụng web cá nhân kết hợp **Calendar**, **Task Tracker** và **Notes**, được xây dựng cho bài tập cá nhân môn FER202 (Custom React Web Application). Task Tracker và Calendar được liên kết với nhau: task có hạn (due date) sẽ tự động hiển thị trên Calendar, giúp quản lý thời gian hiệu quả hơn.

- **Họ tên: Trần Quốc Huy**
- **MSSV: DE200146**
- **Lớp: SE20A04**
- **GitHub repo: [github.com/huytqDE200146/multi-tools](https://github.com/huytqDE200146/multi-tools)**

## Mô tả ứng dụng

Multi Tools là một ứng dụng full-stack cho phép người dùng:

- Quản lý công việc (Task Tracker): thêm/sửa/xoá/đánh dấu hoàn thành task, gán hạn chót.
- Xem lịch (Calendar): hiển thị các task theo ngày, kèm ngày lễ lấy từ API công khai Nager.Date.
- Ghi chú (Notes): tạo, chỉnh sửa, xoá ghi chú dạng văn bản đơn giản.

## Công nghệ sử dụng

**Frontend**

- Create React App
- React Router
- React-Bootstrap
- Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)

**Backend**

- Node.js + Express
- SQLite (`better-sqlite3`)

**API công khai**

- [Nager.Date](https://date.nager.at/) — lấy danh sách ngày lễ theo quốc gia/năm (đáp ứng LO7)

## Cấu trúc dự án

```
multi-tools/
├── client/     # React frontend (CRA)
├── server/     # Node.js + Express + SQLite backend
└── .git/       # Git repo chung cho cả project
```

## Hướng dẫn chạy

### 1. Cài đặt

```powershell
cd multi-tools/server
npm install

cd ../client
npm install
```

### 2. Chạy server (backend)

```powershell
cd multi-tools/server
npm run dev
```

Server chạy tại `http://localhost:<PORT>` (xem `server.js` để biết cổng cụ thể).

### 3. Chạy client (frontend)

```powershell
cd multi-tools/client
npm start
```

Ứng dụng chạy tại `http://localhost:3000`.

## Mapping Learning Outcomes (LO1–LO8)

| LO  | Yêu cầu                                              | Cách triển khai trong Multi Tools                                                                           | Trạng thái                            |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| LO1 | CRA + Git (≥5 commit)                                 | Repo Git tại root, commit theo từng cột mốc (setup, schema, routes, frontend, hoàn thiện)               | Đang thực hiện                       |
| LO2 | Component Class + Functional                           | [Điền tên component Class, vd.`EventCard`] và các component Functional khác (TaskList, NoteEditor...) | Chưa hoàn thành                      |
| LO3 | JSX + ES6                                              | Arrow function, destructuring, template literal dùng xuyên suốt các component                             | Chưa hoàn thành                      |
| LO4 | Bootstrap/React-Bootstrap + CSS tuỳ chỉnh            | Navbar và layout dùng React-Bootstrap; 1 component có CSS custom riêng                                    | Chưa hoàn thành                      |
| LO5 | React Router 3 route (`/`, `/feature`, `/about`) | `/` = Home/Dashboard, `/feature` = Task Tracker (liên kết Calendar), `/about` = giới thiệu app      | Chưa hoàn thành                      |
| LO6 | useState/useEffect + event handler                     | CRUD task/note dùng hooks, xử lý sự kiện thêm/sửa/xoá                                                 | Chưa hoàn thành                      |
| LO7 | Public API + loading/error state + lazy load           | Gọi Nager.Date API cho Calendar; trang`/feature` load bằng `React.lazy` + `Suspense`                  | Backend sẵn sàng, frontend chưa làm |
| LO8 | Redux global state + summary trên navbar              | Redux Toolkit quản lý state task/note; navbar hiển thị số task chưa hoàn thành                        | Chưa hoàn thành                      |

## Đóng góp cá nhân

Đây là bài tập cá nhân, toàn bộ code do [Điền tên] tự thực hiện.

## Minh bạch (Transparency)

Trong quá trình làm bài, mình có sử dụng **Claude (Anthropic)** như một công cụ hướng dẫn: giải thích khái niệm, gợi ý cấu trúc code, review logic theo từng bước. Toàn bộ code được mình tự gõ và chạy thử, Claude không viết thay hoàn chỉnh ứng dụng.
