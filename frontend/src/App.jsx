// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the new Footer component
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // A generic dashboard, perhaps for unauthorized access
import AdminDashboard from './pages/AdminDashboard';
import EducatorDashboard from './pages/EducatorDashboard';
import StudentDashboard from './pages/StudentDashboard';

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
      <div className="flex flex-col min-h-screen"> {/* Added flex-col and min-h-screen for sticky footer */}
        <Navbar />
        <main className="flex-grow"> {/* flex-grow ensures main content takes available space */}
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

            {/* Add more routes as needed (e.g., for privacy policy, terms of service) */}
            <Route path="/privacy-policy" element={<div className="p-8">Privacy Policy Content</div>} />
            <Route path="/terms-of-service" element={<div className="p-8">Terms of Service Content</div>} />
            <Route path="/sitemap" element={<div className="p-8">Sitemap Content</div>} />

          </Routes>
        </main>
        <Footer /> {/* Added the Footer component here */}
      </div>
    </Router>
  );
};

export default App;
