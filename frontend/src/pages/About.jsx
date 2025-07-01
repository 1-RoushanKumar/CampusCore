// src/pages/About.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faUsers, faGlobe, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-8 sm:p-12 bg-white rounded-xl shadow-2xl my-10 border border-blue-200">
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900 text-center border-b-4 pb-4 border-blue-500 drop-shadow-md">
          About <span className="text-blue-700">Campus App</span>
        </h1>

        <section className="mb-12 text-center">
          <p className="text-xl text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto">
            Welcome to **Campus App**, your dedicated platform for enhancing campus life.
            We aim to connect students, faculty, and administration through a seamless
            and intuitive interface. Our mission is to simplify various campus-related
            activities, from academic pursuits to extracurricular engagements.
          </p>
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            We believe in fostering a vibrant and supportive campus community.
            Through our innovative features, we strive to make information
            easily accessible, streamline communication, and provide tools
            that empower every member of the campus. We're committed to continuously
            improving and expanding our services to meet the evolving needs of
            modern campus environments.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Vision & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center border border-blue-200 transform transition-transform duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">Continuously evolving to bring cutting-edge solutions.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md text-center border border-green-200 transform transition-transform duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faUsers} className="text-green-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">Building strong connections within the campus.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-md text-center border border-purple-200 transform transition-transform duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faGlobe} className="text-purple-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Accessibility</h3>
              <p className="text-gray-600">Ensuring information is available to everyone, everywhere.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md text-center border border-yellow-200 transform transition-transform duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faGraduationCap} className="text-yellow-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600">Striving for the highest quality in all our services.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Team</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We are a passionate team of developers, designers, and educators dedicated to
            transforming the campus experience. Our diverse backgrounds and shared commitment
            drive us to create a truly impactful application.
          </p>
          {/* You could add team member cards here */}
        </section>
      </div>
    </div>
  );
};

export default About;