import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, Info, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return '/admin/dashboard';
      case 'ROLE_EDUCATOR':
        return '/educator/dashboard';
      case 'ROLE_STUDENT':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_EDUCATOR':
        return 'Educator';
      case 'ROLE_STUDENT':
        return 'Student';
      default:
        return 'User';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
      <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-1 lg:px-6">
          <div className="flex justify-between items-center h-24"> {/* Changed h-16 to h-24 */}

            {/* Logo */}
            <Link
                to="/"
                className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200"
                onClick={closeMenu}
            >
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Campus App</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                  to="/about"
                  className="flex items-center space-x-1 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link
                  to="/contact"
                  className="flex items-center space-x-1 text-white hover:text-blue-100 transition-colors duration-200 font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              {jwtToken ? (
                  <div className="flex items-center space-x-4">
                    {/* User Badge */}
                    <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-1 rounded-full">
                      <User className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">{getRoleDisplayName()}</span>
                    </div>

                    {/* Dashboard Link */}
                    <Link
                        to={getDashboardPath()}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      Dashboard
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
              ) : (
                  <Link
                      to="/login"
                      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    Login
                  </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden text-white hover:text-blue-100 transition-colors duration-200 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="pt-4 pb-2 space-y-2">
              <Link
                  to="/about"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:text-blue-100 hover:bg-white hover:bg-opacity-10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:text-blue-100 hover:bg-white hover:bg-opacity-10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              {jwtToken ? (
                  <>
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-lg mx-4 my-2">
                      <User className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">Logged in as {getRoleDisplayName()}</span>
                    </div>

                    <Link
                        to={getDashboardPath()}
                        onClick={closeMenu}
                        className="block text-white hover:text-blue-100 hover:bg-white hover:bg-opacity-10 px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      Dashboard
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-white hover:text-red-200 hover:bg-red-500 hover:bg-opacity-20 px-4 py-3 rounded-lg transition-all duration-200 font-medium w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
              ) : (
                  <Link
                      to="/login"
                      onClick={closeMenu}
                      className="block bg-white text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition-all duration-200 mx-4 text-center"
                  >
                    Login
                  </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;