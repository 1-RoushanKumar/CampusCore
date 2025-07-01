// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole'); // Get the user's role

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole'); // Clear role on logout
    navigate('/login');
  };

  // Determine the correct dashboard path based on role
  const getDashboardPath = () => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return '/admin/dashboard';
      case 'ROLE_EDUCATOR':
        return '/educator/dashboard';
      case 'ROLE_STUDENT':
        return '/student/dashboard';
      default:
        return '/dashboard'; // Fallback for generic or undefined roles
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white shadow-xl">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide mb-3 md:mb-0 hover:text-blue-200 transition duration-300">
          Campus App
        </Link>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-lg">
          <li><Link to="/about" className="hover:text-blue-200 transition duration-300 ease-in-out">About</Link></li>
          <li><Link to="/contact" className="hover:text-blue-200 transition duration-300 ease-in-out">Contact Us</Link></li>
          {jwtToken ? (
            <>
              <li>
                <Link to={getDashboardPath()} className="hover:text-blue-200 transition duration-300 ease-in-out">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 transition duration-300 ease-in-out bg-blue-600 px-4 py-1 rounded-full shadow-md hover:bg-blue-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="hover:text-blue-200 transition duration-300 ease-in-out bg-blue-600 px-4 py-1 rounded-full shadow-md hover:bg-blue-700">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
