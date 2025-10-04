
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="course" element={<div>Course Page</div>} />
          <Route path="results" element={<div>Results Page</div>} />
          <Route path="register" element={<div>Register Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
