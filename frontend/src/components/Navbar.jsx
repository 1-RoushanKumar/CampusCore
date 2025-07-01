import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-700 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide">Campus App</Link>
        <ul className="flex space-x-6">
          <li><Link to="/about" className="hover:text-gray-300 transition duration-300 ease-in-out">About</Link></li>
          <li><Link to="/contact" className="hover:text-gray-300 transition duration-300 ease-in-out">Contact Us</Link></li>
          {token ? (
            <>
              <li><Link to="/dashboard" className="hover:text-gray-300 transition duration-300 ease-in-out">Dashboard</Link></li>
              <li><button onClick={handleLogout} className="hover:text-gray-300 transition duration-300 ease-in-out">Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" className="hover:text-gray-300 transition duration-300 ease-in-out">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;