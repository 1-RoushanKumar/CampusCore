// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Your Axios instance

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [enrolledClass, setEnrolledClass] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch Student Profile
        const profileResponse = await api.get('/student/profile');
        setProfile(profileResponse.data);

        // Fetch Enrolled Class
        try {
          const classResponse = await api.get('/student/enrolled-class');
          setEnrolledClass(classResponse.data);
        } catch (classErr) {
          // If 404 or 204 (No Content) for enrolled class, it means no class is assigned
          if (classErr.response && (classErr.response.status === 404 || classErr.response.status === 204)) {
            setEnrolledClass(null); // Explicitly set to null if no class
            console.warn('No enrolled class found for this student.');
          } else {
            console.error('Error fetching enrolled class:', classErr);
            setError('Failed to fetch enrolled class data.');
          }
        }

        // Fetch Feedback
        const feedbackResponse = await api.get('/student/feedback');
        setFeedback(feedbackResponse.data);

      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Loading student dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Student Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Profile</h2>
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center md:justify-start">
              {profile.profileImageUrl ? (
                <img
                  src={`${api.defaults.baseURL}${profile.profileImageUrl}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-5xl font-bold border-4 border-blue-400">
                  {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong className="text-blue-700">Name:</strong> {profile.firstName} {profile.lastName}</p>
              <p><strong className="text-blue-700">Username:</strong> {profile.username}</p>
              <p><strong className="text-blue-700">Email:</strong> {profile.email}</p>
              <p><strong className="text-blue-700">Grade:</strong> {profile.grade || 'N/A'}</p>
              <p><strong className="text-blue-700">Enrollment Date:</strong> {profile.enrollmentDate}</p>
              <p><strong className="text-blue-700">Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
              <p><strong className="text-blue-700">Address:</strong> {profile.address || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Profile information not available.</p>
        )}
      </div>

      {/* Enrolled Class Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Enrolled Class</h2>
        {enrolledClass ? (
          <div className="space-y-2 text-gray-700">
            <p><strong className="text-blue-700">Class Name:</strong> {enrolledClass.className}</p>
            <p><strong className="text-blue-700">Class Code:</strong> {enrolledClass.classCode}</p>
            <p><strong className="text-blue-700">Description:</strong> {enrolledClass.description || 'N/A'}</p>
            <h4 className="font-semibold mt-4 text-blue-700">Class Educators:</h4>
            {enrolledClass.educators && enrolledClass.educators.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {enrolledClass.educators.map((educator) => (
                  <li key={educator.id}>{educator.firstName} {educator.lastName} ({educator.email})</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 ml-4">No educators assigned to this class.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">You are not currently enrolled in a class.</p>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Feedback</h2>
        {feedback && feedback.length > 0 ? (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div key={item.id} className="border border-gray-200 p-4 rounded-md shadow-sm">
                <p><strong className="text-blue-700">From Educator:</strong> {item.educatorFirstName} {item.educatorLastName}</p>
                <p><strong className="text-blue-700">Class:</strong> {item.className}</p>
                <p><strong className="text-blue-700">Rating:</strong> {item.rating}/5</p>
                <p className="mt-2 text-gray-800">{item.feedbackText}</p>
                <p className="text-sm text-gray-500 mt-2">Date: {new Date(item.feedbackDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No feedback available yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
