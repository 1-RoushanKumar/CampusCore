// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // A generic dashboard, perhaps for unauthorized access
import AdminDashboard from './pages/AdminDashboard'; // You'll create this
import EducatorDashboard from './pages/EducatorDashboard'; // You'll create this
import StudentDashboard from './pages/StudentDashboard'; // You'll create this

// A more robust private route component with role checking
const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Authenticated but not authorized for this role, redirect to a forbidden page or generic dashboard
    // You might want a more specific "Access Denied" page here.
    return <Navigate to="/dashboard" replace />; // Or /access-denied
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Generic Dashboard - Accessible if logged in but maybe no specific role route matches */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Educator Dashboard */}
          <Route
            path="/educator/dashboard"
            element={
              <PrivateRoute allowedRoles={['ROLE_EDUCATOR']}>
                <EducatorDashboard />
              </PrivateRoute>
            }
          />

          {/* Student Dashboard */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute allowedRoles={['ROLE_STUDENT']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Add more routes as needed */}
        </Routes>
      </main>
    </Router>
  );
};

export default App;