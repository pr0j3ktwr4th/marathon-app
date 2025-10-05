
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Course from './pages/Course';
import Results from './pages/Results';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="course" element={<Course />} />
          <Route path="results" element={<Results />} />
          <Route path="register" element={<Register />} />
          <Route path="registration-success" element={<RegistrationSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
