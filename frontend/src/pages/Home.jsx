import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 text-center leading-tight">Welcome to <span className="text-blue-600">Campus App!</span></h1>
      <p className="text-xl sm:text-2xl text-gray-700 text-center max-w-2xl">Your one-stop solution for a seamless and enriched campus experience.</p>
    </div>
  );
};

export default Home;