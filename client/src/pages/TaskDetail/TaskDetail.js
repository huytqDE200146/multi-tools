import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Form, Button, Alert } from 'react-bootstrap';
import { updateTask } from '../../features/tasks/tasksSlice';
import { fetchAllLessonsApi } from '../../api/lessonsApi';
import { fetchSubjectsApi } from '../../api/subjectsApi';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../constants/priority';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const task = useSelector((state) =>
    state.tasks.items.find((t) => String(t.id) === id)
  );

  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  const [allLessons, setAllLessons] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      setSelectedLessonId(task.relatedLessonId ? String(task.relatedLessonId) : '');
    }
  }, [task]);

  // Tải toàn bộ lessons + subjects 1 lần để build dropdown "Subject - Lesson"
  useEffect(() => {
    fetchAllLessonsApi().then(setAllLessons).catch(() => setAllLessons([]));
    fetchSubjectsApi().then(setAllSubjects).catch(() => setAllSubjects([]));
  }, []);

  if (!task) {
    return (
      <div>
        <Alert variant="warning">Không tìm thấy nhiệm vụ này (có thể đã bị xóa).</Alert>
        <Link to="/tasks">← Quay lại danh sách nhiệm vụ</Link>
      </div>
    );
  }

  const statusLabel =
    task.status === 'done' ? 'Hoàn thành' : task.status === 'in-progress' ? 'Đang làm' : 'Chưa làm';
  const statusVariant =
    task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'secondary';

  const handleSaveDescription = (e) => {
    e.preventDefault();
    dispatch(updateTask({ id: task.id, changes: { description } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Tìm subjectId tương ứng với lesson đang được chọn, để tạo link điều hướng
  const selectedLesson = allLessons.find((l) => String(l.id) === selectedLessonId);

  const handleSelectLesson = (e) => {
    const value = e.target.value;
    setSelectedLessonId(value);
    dispatch(
      updateTask({
        id: task.id,
        changes: { relatedLessonId: value ? Number(value) : null },
      })
    );
  };

  const handleGoToLesson = () => {
    if (!selectedLesson) return;
    navigate(`/lessons/${selectedLesson.subjectId}/${selectedLesson.id}`);
  };

  // Nhãn hiển thị dạng "Tên môn - Tên bài học"
  const getLessonLabel = (lesson) => {
    const subject = allSubjects.find((s) => s.id === lesson.subjectId);
    return `${subject ? subject.name : '???'} - ${lesson.title}`;
  };

  return (
    <div>
      <Link to="/tasks" className="d-inline-block mb-3">
        ← Quay lại danh sách nhiệm vụ
      </Link>

      <h1>{task.title}</h1>

      <div className="mb-3">
        <Badge bg={statusVariant} className="me-2">
          {statusLabel}
        </Badge>
        {task.priority && (
          <Badge bg={PRIORITY_COLORS[task.priority]} className="me-2">
            {PRIORITY_LABELS[task.priority]}
          </Badge>
        )}
        {task.dueDate && <span className="text-muted">Hạn: {task.dueDate}</span>}
      </div>

      <Form onSubmit={handleSaveDescription}>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả chi tiết</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Nhập mô tả cho nhiệm vụ này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Lưu mô tả
        </Button>
        {saved && <span className="ms-3 text-success">Đã lưu!</span>}
      </Form>

      <Form.Group className="mt-4">
        <Form.Label>Bài học liên quan</Form.Label>
        <div className="d-flex gap-2">
          <Form.Select value={selectedLessonId} onChange={handleSelectLesson}>
            <option value="">-- Không liên kết --</option>
            {allLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {getLessonLabel(lesson)}
              </option>
            ))}
          </Form.Select>
          <Button
            variant="outline-primary"
            disabled={!selectedLesson}
            onClick={handleGoToLesson}
            className="flex-shrink-0"
          >
            Đi tới bài học →
          </Button>
        </div>
      </Form.Group>
    </div>
  );
};

export default TaskDetail;