import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import AppNavbar from './components/Navbar/AppNavbar';
import Home from './pages/Home/Home';
import About from './pages/About/About';

// Lazy load trang Feature — code của trang này chỉ được tải khi người dùng vào /feature
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
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;