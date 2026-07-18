import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import AppNavbar from './components/Navbar/AppNavbar';
import Home from './pages/Home/Home';
import Tasks from './pages/Tasks/Tasks';
import TaskDetail from './pages/TaskDetail/TaskDetail';
import Lessons from './pages/Lessons/Lessons';
import SubjectDetail from './pages/SubjectDetail/SubjectDetail';
import LessonDetail from './pages/LessonDetail/LessonDetail';
import ReviewGrid from './pages/ReviewGrid/ReviewGrid';
import About from './pages/About/About';

const Feature = lazy(() => import('./pages/Feature/Feature'));

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <div className="container py-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/feature"
            element={
              <Suspense
                fallback={
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2">Đang tải trang...</p>
                  </div>
                }
              >
                <Feature />
              </Suspense>
            }
          />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:subjectId" element={<SubjectDetail />} />
          <Route path="/lessons/:subjectId/:lessonId" element={<LessonDetail />} />
          <Route path="/lessons/:subjectId/:lessonId/review" element={<ReviewGrid />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;