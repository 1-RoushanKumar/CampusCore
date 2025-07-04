import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faEnvelope,
    faPhoneAlt,
    faClock,
    faCalendarAlt,
    faCar,
    faUsers,
    faBook,
    faArrowRight // Used for the arrow icon
} from '@fortawesome/free-solid-svg-icons';

// Import the custom CSS file
import '../styles/ContactPage.css'; // Adjust path if your file is elsewhere

const Contact = () => {
    return (
        // Body background and min-height applied to the main div
        <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] text-gray-800">
            <main className="container mx-auto px-4 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    {/* elegant-heading and animate-float class from custom CSS */}
                    <h2
                        className="text-5xl md:text-6xl font-bold elegant-heading text-white mb-6 animate-float"
                    >
                        Contact CampusCore
                    </h2>
                    <p className="text-xl text-white/90 font-light max-w-2xl mx-auto">
                        We'd love to hear from you. Reach out to us and let's start a
                        conversation about your educational journey.
                    </p>
                </div>

                {/* Main content grid for 2x2 layout on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information Section */}
                    <section>
                        {/* glass-effect and floating-card classes. Tailwind for glass-effect, custom for floating-card hover */}
                        <div
                            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full
                         transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                        >
                            {/* elegant-heading and gradient-text from custom CSS */}
                            <h3 className="text-4xl font-bold elegant-heading gradient-text mb-8">
                                Get in Touch
                            </h3>

                            {/* Address */}
                            <div className="flex items-start mb-8 group">
                                {/* contact-icon from custom CSS */}
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center rounded-full mr-5 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl"/>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-2xl text-gray-900 mb-2">
                                        Our Location
                                    </h4>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        CampusCore School<br/>
                                        123 Education Boulevard<br/>
                                        Knowledge City, State 12345<br/>
                                        Country
                                    </p>
                                </div>
                            </div>

                            {/* section-divider from custom CSS */}
                            <div
                                className="h-px bg-gradient-to-r from-transparent via-[#667eea]/30 to-transparent my-8"></div>

                            {/* Email */}
                            <div className="flex items-center mb-8 group">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center rounded-full mr-5 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-xl"/>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-2xl text-gray-900 mb-2">
                                        Email Us
                                    </h4>
                                    <p className="text-gray-700 text-lg">
                                        <a
                                            href="mailto:info@campuscore.edu"
                                            className="text-purple-600 hover:text-purple-700 transition duration-300 font-medium"
                                        >info@campuscore.edu</a
                                        >
                                    </p>
                                </div>
                            </div>

                            {/* section-divider */}
                            <div
                                className="h-px bg-gradient-to-r from-transparent via-[#667eea]/30 to-transparent my-8"></div>

                            {/* Phone */}
                            <div className="flex items-center mb-8 group">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center rounded-full mr-5 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl">
                                    <FontAwesomeIcon icon={faPhoneAlt} className="text-xl"/>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-2xl text-gray-900 mb-2">
                                        Call Us
                                    </h4>
                                    <p className="text-gray-700 text-lg">
                                        <a
                                            href="tel:+11234567890"
                                            className="text-purple-600 hover:text-purple-700 transition duration-300 font-medium"
                                        >(123) 456-7890</a
                                        >
                                    </p>
                                </div>
                            </div>

                            {/* section-divider */}
                            <div
                                className="h-px bg-gradient-to-r from-transparent via-[#667eea]/30 to-transparent my-8"></div>

                            {/* Office Hours */}
                            <div className="flex items-center mb-8 group">
                                <div
                                    className="w-16 h-16 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center rounded-full mr-5 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl">
                                    <FontAwesomeIcon icon={faClock} className="text-xl"/>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-2xl text-gray-900 mb-2">
                                        Office Hours
                                    </h4>
                                    <p className="text-gray-700 text-lg">
                                        Monday - Friday: 8:00 AM - 4:00 PM<br/>
                                        <span className="text-sm text-gray-500"
                                        >Weekend appointments available upon request</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Google Map Section */}
                    <section>
                        <div
                            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden h-full
                         transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <div className="p-8 pb-6">
                                <h3 className="text-4xl font-bold elegant-heading gradient-text mb-4">
                                    Find Us on the Map
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    Visit our beautiful campus located in the heart of Knowledge
                                    City
                                </p>
                            </div>
                            <div className="px-8 pb-8">
                                {/* map-container class for optional overlay */}
                                <div className="map-container rounded-2xl overflow-hidden shadow-xl">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.0830491062637!2d81.65682897530591!3d21.25875228026131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28db9405615783%3A0xf69335805561536b!2sNational%20Institute%20of%20Technology%20Raipur!5e0!3m2!1sen!2sin!4v1719999999999!5m2!1sen!2sin"
                                        width="100%"
                                        height="400"
                                        style={{border: 0}} // Inline style for border-0
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="CampusCore Location" // Added title for accessibility
                                    ></iframe>
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-6 italic">
                                    *Demo location shown (NIT Raipur, Chhattisgarh, India). Please update with your
                                    actual school
                                    coordinates.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section>
                        <div
                            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full
                         transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <h4 className="font-bold text-3xl elegant-heading gradient-text mb-6">
                                Send us a Message
                            </h4>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-gray-700 text-sm font-semibold mb-3"
                                        >Full Name</label
                                        >
                                        <input
                                            type="text"
                                            id="name"
                                            className="bg-white/90 border-2 border-transparent transition-all duration-300 ease-in-out focus:bg-white focus:border-[#667eea] focus:ring-0 focus:shadow-outline rounded-xl w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 text-sm font-semibold mb-3"
                                        >Email Address</label
                                        >
                                        <input
                                            type="email"
                                            id="email"
                                            className="bg-white/90 border-2 border-transparent transition-all duration-300 ease-in-out focus:bg-white focus:border-[#667eea] focus:ring-0 focus:shadow-outline rounded-xl w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-gray-700 text-sm font-semibold mb-3"
                                    >Subject</label
                                    >
                                    <input
                                        type="text"
                                        id="subject"
                                        className="bg-white/90 border-2 border-transparent transition-all duration-300 ease-in-out focus:bg-white focus:border-[#667eea] focus:ring-0 focus:shadow-outline rounded-xl w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-700 text-sm font-semibold mb-3"
                                    >Message</label
                                    >
                                    <textarea
                                        id="message"
                                        rows="6"
                                        className="bg-white/90 border-2 border-transparent transition-all duration-300 ease-in-out focus:bg-white focus:border-[#667eea] focus:ring-0 focus:shadow-outline rounded-xl w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="luxury-button text-white font-bold py-4 px-8 rounded-xl focus:outline-none w-full text-lg"
                                >
                                    <span className="relative z-10">Send Message</span>
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Campus Information Grid */}
                    <section>
                        <div
                            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 h-full
                         transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <h4 className="text-3xl font-bold elegant-heading gradient-text mb-8">
                                Campus Information
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Campus Tour */}
                                <div
                                    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 group hover:shadow-lg transition duration-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"
                                        >
                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl"/>
                                        </div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-3">
                                            Campus Tour
                                        </h5>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Schedule a guided tour of our facilities and classrooms
                                        </p>
                                        <button
                                            className="text-purple-600 font-semibold hover:text-purple-700 transition duration-300 text-sm"
                                        >
                                            Book Tour <FontAwesomeIcon icon={faArrowRight} className="ml-1"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Visitor Parking */}
                                <div
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 group hover:shadow-lg transition duration-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"
                                        >
                                            <FontAwesomeIcon icon={faCar} className="text-white text-xl"/>
                                        </div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-3">
                                            Visitor Parking
                                        </h5>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Free parking available with easy highway access
                                        </p>
                                        <button
                                            className="text-blue-600 font-semibold hover:text-blue-700 transition duration-300 text-sm"
                                        >
                                            Get Directions <FontAwesomeIcon icon={faArrowRight} className="ml-1"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Student Services */}
                                <div
                                    className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 group hover:shadow-lg transition duration-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"
                                        >
                                            <FontAwesomeIcon icon={faUsers} className="text-white text-xl"/>
                                        </div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-3">
                                            Student Services
                                        </h5>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Academic support and counseling services available
                                        </p>
                                        <button
                                            className="text-green-600 font-semibold hover:text-green-700 transition duration-300 text-sm"
                                        >
                                            Learn More <FontAwesomeIcon icon={faArrowRight} className="ml-1"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Library & Resources */}
                                <div
                                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 group hover:shadow-lg transition duration-300"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"
                                        >
                                            <FontAwesomeIcon icon={faBook} className="text-white text-xl"/>
                                        </div>
                                        <h5 className="text-lg font-semibold text-gray-800 mb-3">
                                            Library & Resources
                                        </h5>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Modern library with digital resources and study spaces
                                        </p>
                                        <button
                                            className="text-orange-600 font-semibold hover:text-orange-700 transition duration-300 text-sm"
                                        >
                                            Explore <FontAwesomeIcon icon={faArrowRight} className="ml-1"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Contact;