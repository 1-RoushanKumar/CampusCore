import React from 'react';
import {Link} from 'react-router-dom';
import {Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Campus App
                            </h3>
                            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                                Empowering education through innovative technology and seamless digital experiences.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#"
                               className="text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform">
                                <Facebook size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform">
                                <Twitter size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-pink-400 transition-colors duration-300 hover:scale-110 transform">
                                <Instagram size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform">
                                <Linkedin size={20}/>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/courses"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Courses
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/support"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy-policy"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookie-policy"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/sitemap"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block">
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Contact</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-slate-300">
                                <Mail size={16} className="text-blue-400"/>
                                <span className="text-sm">contact@campusapp.edu</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-300">
                                <Phone size={16} className="text-blue-400"/>
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-300">
                                <MapPin size={16} className="text-blue-400"/>
                                <span className="text-sm">123 Education St, Learning City</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700 bg-slate-900/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-slate-400 text-sm">
                            &copy; {currentYear} Campus App. All rights reserved.
                        </p>
                        <p className="text-slate-500 text-xs">
                            Made with ❤️ for modern education
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;