// src/pages/Contact.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto p-8 sm:p-12 bg-white rounded-xl shadow-2xl my-10 border border-blue-200">
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900 text-center border-b-4 pb-4 border-blue-500 drop-shadow-md">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto leading-relaxed">
          We'd love to hear from you! If you have any questions, feedback,
          or need support, please don't hesitate to reach out. Your input
          is invaluable as we strive to make Campus App the best it can be.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Contact Information Section */}
          <div className="bg-blue-50 shadow-lg rounded-xl p-8 border border-blue-200 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 text-blue-600" /> Quick Contacts
            </h2>
            <div className="space-y-5">
              <p className="text-lg text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-4 text-blue-500 text-2xl" />
                <strong className="w-24">Email:</strong> <a href="mailto:support@campusapp.com" className="text-blue-600 hover:underline">support@campusapp.com</a>
              </p>
              <p className="text-lg text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-4 text-blue-500 text-2xl" />
                <strong className="w-24">Phone:</strong> <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 (555) 123-4567</a>
              </p>
              <p className="text-lg text-gray-800 flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-4 text-blue-500 text-2xl mt-1" />
                <strong className="w-24">Address:</strong> 123 Campus Lane, University City, UX 12345
              </p>
            </div>
          </div>

          {/* Contact Form Section (Placeholder) */}
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send us a Message</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input type="text" id="name" name="name" placeholder="John Doe"
                       className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input type="email" id="email" name="email" placeholder="john.doe@example.com"
                       className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea id="message" name="message" rows="5" placeholder="Type your message here..."
                          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
