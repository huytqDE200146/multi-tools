/**
 * Chuyển chuỗi ngày dạng ISO "YYYY-MM-DD" (dùng để lưu trữ/so sánh)
 * sang định dạng hiển thị "DD/MM/YYYY" (dễ đọc với người Việt).
 */
export function formatDateDisplay(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}