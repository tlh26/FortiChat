import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegistrationPage from './Pages/RegistrationPage';
import LoginPage from './Pages/LoginPage';

const WelcomePage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-light">
      <h1 className="text-4xl font-bold text-primary mb-6">Welcome to FortiChat</h1>
      <p className="text-secondary mb-8 text-center">
        Your secure and user-friendly chat platform. Please register or login to get started.
      </p>
      <div className="space-x-4">
        <Link to="/register">
          <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition duration-200">
            Register
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-2 bg-secondary text-primary font-semibold rounded-lg hover:bg-light transition duration-200">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
