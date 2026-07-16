import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar/AppNavbar';
import Home from './pages/Home/Home';
import Feature from './pages/Feature/Feature';
import About from './pages/About/About';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <div className="container py-2">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feature" element={<Feature />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;