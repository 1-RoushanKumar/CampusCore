import React from 'react';

const About = () => {
    return (
        // The main container now uses the linear gradient background from the HTML
        // and ensures it takes full height.
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800 py-8 md:py-12">
            {/* Container for the main content, centering it and adding padding */}
            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Main page heading with Playfair Display font, white color, and shadow */}
                <h2 className="text-4xl font-extrabold text-center mb-10 md:mb-16 font-['Playfair_Display'] text-white drop-shadow-lg">
                    About CampusCore
                </h2>

                {/* Section 1: Image Left, Text Right */}
                <section
                    className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-6 mb-10 md:mb-16"
                >
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                        <img
                            src="https://placehold.co/400x400/007bff/ffffff?text=Principal+Image"
                            alt="James Wilson"
                            className="w-full h-auto rounded-lg shadow-md object-cover max-w-xs md:max-w-full"
                        />
                        <div className="text-center mt-3">
                            <p className="font-semibold text-lg text-blue-700">James Wilson</p>
                            <p className="text-sm text-gray-600">Principal</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                        {/* Section heading with Playfair Display font */}
                        <h3 className="text-3xl font-bold text-blue-800 mb-4 font-['Playfair_Display']">
                            A Message from Our Principal
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            "At CampusCore, we believe in fostering an environment where every
                            student can thrive academically, socially, and personally. Our
                            dedicated faculty and staff are committed to providing a holistic
                            education that prepares young minds for the challenges and
                            opportunities of the future. We are proud of our vibrant community
                            and the strong foundation we build for lifelong learning."
                        </p>
                    </div>
                </section>

                {/* Section 2: Text Left, Image Right (reversed order for md screens) */}
                <section
                    className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl shadow-lg p-6 mb-10 md:mb-16"
                >
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 md:ml-8">
                        <img
                            src="https://placehold.co/400x400/28a745/ffffff?text=Head+of+Academics+Image"
                            alt="Dr. Sarah Chen"
                            className="w-full h-auto rounded-lg shadow-md object-cover max-w-xs md:max-w-full"
                        />
                        <div className="text-center mt-3">
                            <p className="font-semibold text-lg text-green-700">Dr. Sarah Chen</p>
                            <p className="text-sm text-gray-600">Head of Academics</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-right">
                        {/* Section heading with Playfair Display font */}
                        <h3 className="text-3xl font-bold text-green-800 mb-4 font-['Playfair_Display']">
                            Our Commitment to Academic Excellence
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            "Our curriculum at CampusCore is designed to be rigorous, engaging,
                            and relevant. We encourage critical thinking, creativity, and
                            problem-solving skills through innovative teaching methodologies.
                            Our goal is to inspire a love for learning and equip students with
                            the knowledge and tools they need to succeed in a rapidly changing
                            world."
                        </p>
                    </div>
                </section>

                {/* Section 3: Image Left, Text Right */}
                <section
                    className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg p-6 mb-10 md:mb-16"
                >
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                        <img
                            src="https://placehold.co/400x400/ffc107/ffffff?text=Student+Council+President+Image"
                            alt="Emily Davis"
                            className="w-full h-auto rounded-lg shadow-md object-cover max-w-xs md:max-w-full"
                        />
                        <div className="text-center mt-3">
                            <p className="font-semibold text-lg text-yellow-700">Emily Davis</p>
                            <p className="text-sm text-gray-600">Student Council President</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                        {/* Section heading with Playfair Display font */}
                        <h3 className="text-3xl font-bold text-yellow-800 mb-4 font-['Playfair_Display']">
                            Student Life at CampusCore
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            "Being a student at CampusCore is an incredible experience! From
                            diverse clubs and sports to engaging events and leadership
                            opportunities, there's always something happening. We have a
                            supportive community where everyone feels welcome and encouraged to
                            explore their passions. It's truly a place where friendships are
                            made and futures are shaped."
                        </p>
                    </div>
                </section>

                {/* This section appears to be a duplicate of Section 2 from your HTML.
            If it's intentional, keep it. Otherwise, you might want to remove or modify it.
            For now, I'm including it as is. */}
                <section
                    className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl shadow-lg p-6 mb-10 md:mb-16"
                >
                    <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0 md:ml-8">
                        <img
                            src="https://placehold.co/400x400/28a745/ffffff?text=Head+of+Academics+Image"
                            alt="Dr. Sarah Chen"
                            className="w-full h-auto rounded-lg shadow-md object-cover max-w-xs md:max-w-full"
                        />
                        <div className="text-center mt-3">
                            <p className="font-semibold text-lg text-green-700">Dr. Sarah Chen</p>
                            <p className="text-sm text-gray-600">Head of Academics</p>
                        </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-right">
                        {/* Section heading with Playfair Display font */}
                        <h3 className="text-3xl font-bold text-green-800 mb-4 font-['Playfair_Display']">
                            Our Commitment to Academic Excellence
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            "Our curriculum at CampusCore is designed to be rigorous, engaging,
                            and relevant. We encourage critical thinking, creativity, and
                            problem-solving skills through innovative teaching methodologies.
                            Our goal is to inspire a love for learning and equip students with
                            the knowledge and tools they need to succeed in a rapidly changing
                            world."
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;