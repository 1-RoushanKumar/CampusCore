import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto p-8 sm:p-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b-2 pb-2 border-blue-500">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        We'd love to hear from you! If you have any questions, feedback,
        or need support, please don't hesitate to reach out. Your input
        is invaluable as we strive to make Campus App the best it can be.
      </p>
      <div className="bg-blue-50 shadow-lg rounded-xl p-8 max-w-md mx-auto">
        <p className="text-xl text-gray-800 mb-4 font-semibold">Get in Touch:</p>
        <p className="text-md text-gray-800 mb-3 flex items-center"><strong className="w-24">Email:</strong> <a href="mailto:support@campusapp.com" className="text-blue-600 hover:underline">support@campusapp.com</a></p>
        <p className="text-md text-gray-800 mb-3 flex items-center"><strong className="w-24">Phone:</strong> <a href="tel:+15551234567" className="text-blue-600 hover:underline">+1 (555) 123-4567</a></p>
        <p className="text-md text-gray-800 flex items-start"><strong className="w-24">Address:</strong> 123 Campus Lane, University City, UX 12345</p>
      </div>
      <p className="text-lg text-gray-700 mt-10 text-center">
        Alternatively, you can fill out the form below, and we'll get back to you as soon as possible.
      </p>
    </div>
  );
};

export default Contact; 
