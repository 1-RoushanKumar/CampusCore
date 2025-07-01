// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faChalkboardTeacher,
  faUserShield,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-6 text-center leading-tight drop-shadow-lg">
        Welcome to <span className="text-blue-700">Campus App!</span>
      </h1>
      <p className="text-xl sm:text-2xl text-gray-700 text-center max-w-3xl mb-10 leading-relaxed">
        Your comprehensive platform for seamless academic management,
        communication, and growth. Connect, learn, and excel with ease.
      </p>

      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 mb-12">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center text-lg"
        >
          <FontAwesomeIcon icon={faGraduationCap} className="mr-3" /> Get
          Started
        </Link>
        <Link
          to="/about"
          className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center text-lg"
        >
          <FontAwesomeIcon icon={faEye} className="mr-3" /> Learn More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border border-blue-200">
          <FontAwesomeIcon
            icon={faChalkboardTeacher}
            className="text-blue-600 text-4xl mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            For Educators
          </h3>
          <p className="text-gray-600">
            Manage classes, track student progress, and provide valuable
            feedback.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border border-green-200">
          <FontAwesomeIcon
            icon={faGraduationCap}
            className="text-green-600 text-4xl mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            For Students
          </h3>
          <p className="text-gray-600">
            Access courses, view grades, and stay informed about campus
            activities.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center border border-purple-200">
          <FontAwesomeIcon
            icon={faUserShield}
            className="text-purple-600 text-4xl mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            For Administrators
          </h3>
          <p className="text-gray-600">
            Effortlessly manage users, classes, subjects, and overall system
            settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
