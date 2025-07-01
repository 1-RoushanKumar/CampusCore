// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto shadow-inner">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p className="text-lg font-semibold">&copy; {currentYear} Campus App. All rights reserved.</p>
          <p className="text-sm text-gray-400">Designed with modern education in mind.</p>
        </div>
        <div className="flex space-x-6">
          <Link to="/privacy-policy" className="text-gray-300 hover:text-blue-400 transition duration-300">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-gray-300 hover:text-blue-400 transition duration-300">Terms of Service</Link>
          <Link to="/sitemap" className="text-gray-300 hover:text-blue-400 transition duration-300">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;