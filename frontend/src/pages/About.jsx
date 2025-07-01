import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-8 sm:p-12 bg-white rounded-lg shadow-lg my-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b-2 pb-2 border-blue-500">About Us</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        Welcome to **Campus App**, your dedicated platform for enhancing campus life.
        We aim to connect students, faculty, and administration through a seamless
        and intuitive interface. Our mission is to simplify various campus-related
        activities, from academic pursuits to extracurricular engagements.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        We believe in fostering a vibrant and supportive campus community.
        Through our innovative features, we strive to make information
        easily accessible, streamline communication, and provide tools
        that empower every member of the campus. We're committed to continuously
        improving and expanding our services to meet the evolving needs of
        modern campus environments.
      </p>
    </div>
  );
};

export default About;