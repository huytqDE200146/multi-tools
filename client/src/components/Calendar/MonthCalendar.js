import React from 'react';
import './MonthCalendar.css';

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_LABELS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

// Tạo ma trận các tuần trong tháng, mỗi tuần là mảng 7 phần tử (số ngày hoặc null)
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // JS: getDay() trả 0=CN,1=T2,...,6=T7 -> quy đổi để T2=0,...,CN=6
  const firstWeekday = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// Chuyển (năm, tháng, ngày) thành chuỗi "YYYY-MM-DD" để so khớp với task.dueDate
const formatDateKey = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const MonthCalendar = ({ tasks, currentDate, onPrevMonth, onNextMonth }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getMonthMatrix(year, month);
  const today = new Date();

  const isToday = (day) =>
    day &&
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const hasTask = (day) => {
    if (!day) return false;
    const key = formatDateKey(year, month, day);
    return tasks.some((t) => t.dueDate === key);
  };

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <button className="month-nav-btn" onClick={onPrevMonth} aria-label="Tháng trước">
          ‹
        </button>
        <h2 className="month-calendar-title">
          {MONTH_LABELS[month]} {year}
        </h2>
        <button className="month-nav-btn" onClick={onNextMonth} aria-label="Tháng sau">
          ›
        </button>
      </div>

      <div className="month-calendar-grid">
        {DAY_LABELS.map((label) => (
          <div key={label} className="month-calendar-daylabel">
            {label}
          </div>
        ))}

        {weeks.flat().map((day, idx) => (
          <div
            key={idx}
            className={`month-calendar-cell ${day ? '' : 'empty'} ${isToday(day) ? 'today' : ''}`}
          >
            {day && (
              <>
                <span className="month-calendar-daynum">{day}</span>
                {hasTask(day) && <span className="month-calendar-dot" />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;