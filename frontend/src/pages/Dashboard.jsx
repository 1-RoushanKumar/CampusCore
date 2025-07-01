// src/pages/Dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserShield, faChalkboardTeacher, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Get the user's role

  const handleGoToSpecificDashboard = () => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'ROLE_EDUCATOR':
        navigate('/educator/dashboard');
        break;
      case 'ROLE_STUDENT':
        navigate('/student/dashboard');
        break;
      default:
        // If no specific role or role not recognized, stay here or redirect to login
        navigate('/login');
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center border border-purple-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to Your <span className="text-purple-700">Dashboard!</span>
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-xl mx-auto">
          You've successfully logged in. Please select your role to proceed to your specific dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-100 p-6 rounded-lg shadow-md border border-blue-300 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faUserShield} className="text-blue-600 text-5xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin</h3>
            <p className="text-gray-600 text-sm">Full system control.</p>
            <Link to="/admin/dashboard" className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-md">Go to Admin</Link>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-md border border-green-300 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600 text-5xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Educator</h3>
            <p className="text-gray-600 text-sm">Manage classes & students.</p>
            <Link to="/educator/dashboard" className="mt-4 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 shadow-md">Go to Educator</Link>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow-md border border-yellow-300 flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faGraduationCap} className="text-yellow-600 text-5xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Student</h3>
            <p className="text-gray-600 text-sm">Access courses & feedback.</p>
            <Link to="/student/dashboard" className="mt-4 bg-yellow-600 text-white px-5 py-2 rounded-full hover:bg-yellow-700 transition-colors duration-200 shadow-md">Go to Student</Link>
          </div>
        </div>

        {/* Optional: A button to automatically redirect if role is known */}
        {userRole && (
          <button
            onClick={handleGoToSpecificDashboard}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center mx-auto text-lg"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-3" /> Continue to My Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
