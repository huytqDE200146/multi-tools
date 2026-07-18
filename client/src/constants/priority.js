// Thứ tự độ ưu tiên, dùng để sắp xếp (số càng lớn càng ưu tiên cao)
export const PRIORITY_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
  extreme: 4,
};

// Nhãn tiếng Việt hiển thị cho từng mức độ ưu tiên
export const PRIORITY_LABELS = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  extreme: 'Cực cao',
};

// Màu Bootstrap tương ứng cho từng mức độ ưu tiên
export const PRIORITY_COLORS = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  extreme: 'danger',
};