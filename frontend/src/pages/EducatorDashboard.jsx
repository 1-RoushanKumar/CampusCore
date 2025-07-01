// src/pages/EducatorDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Your Axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCommentMedical, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/common/Modal'; // Reusing the Modal component

const EducatorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [classesTaught, setClassesTaught] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination for students in class
  const [studentPage, setStudentPage] = useState(0);
  const [studentSize, setStudentSize] = useState(10);
  const [studentTotalPages, setStudentTotalPages] = useState(0);

  // State for Student Details Modal
  const [isStudentDetailModalOpen, setIsStudentDetailModalOpen] = useState(false);
  const [currentStudentDetail, setCurrentStudentDetail] = useState(null);

  // State for Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackStudent, setFeedbackStudent] = useState(null); // Student for whom feedback is being given
  const [feedbackFormData, setFeedbackFormData] = useState({
    feedbackText: '',
    rating: 0,
  });
  const [existingFeedback, setExistingFeedback] = useState([]); // Feedback given by this educator to this student in this class

  // --- Fetch Educator Data (Profile and Classes) ---
  const fetchEducatorData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileResponse, classesResponse] = await Promise.all([
        api.get('/educator/profile'),
        api.get('/educator/classes'),
      ]);
      setProfile(profileResponse.data);
      setClassesTaught(classesResponse.data);
      if (classesResponse.data.length > 0) {
        setSelectedClassId(classesResponse.data[0].id); // Automatically select the first class
      }
    } catch (err) {
      console.error('Error fetching educator dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Students in Selected Class ---
  const fetchStudentsInClass = useCallback(async (classId, pageNum = studentPage) => {
    if (!classId) {
      setStudentsInClass([]);
      setStudentTotalPages(0);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/educator/classes/${classId}/students`, {
        params: { page: pageNum, size: studentSize },
      });
      setStudentsInClass(response.data.content);
      setStudentTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(`Error fetching students for class ${classId}:`, err);
      setError('Failed to fetch students for the selected class.');
      setStudentsInClass([]);
    } finally {
      setLoading(false);
    }
  }, [studentPage, studentSize]); // Dependency on studentPage and studentSize

  useEffect(() => {
    fetchEducatorData();
  }, []); // Fetch profile and classes once on mount

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsInClass(selectedClassId);
    }
  }, [selectedClassId, fetchStudentsInClass]); // Fetch students when selectedClassId changes

  // --- Handlers ---
  const handleClassChange = (e) => {
    setSelectedClassId(Number(e.target.value));
    setStudentPage(0); // Reset student pagination when class changes
  };

  const handleStudentPageChange = (newPage) => {
    if (newPage >= 0 && newPage < studentTotalPages) {
      setStudentPage(newPage);
    }
  };

  const handleViewStudentDetail = async (studentId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/educator/students/${studentId}`);
      setCurrentStudentDetail(response.data);
      setIsStudentDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching student detail:', err);
      setError('Failed to fetch student details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFeedback = async (student) => {
    setFeedbackStudent(student);
    setFeedbackFormData({ feedbackText: '', rating: 0 });
    setExistingFeedback([]); // Clear previous feedback

    if (selectedClassId && student.id) {
      try {
        const response = await api.get(`/educator/students/${student.id}/classes/${selectedClassId}/feedback`);
        setExistingFeedback(response.data);
        // If there's existing feedback, pre-fill the form with the most recent one
        if (response.data.length > 0) {
          const latestFeedback = response.data[0]; // Assuming latest is first or you sort
          setFeedbackFormData({
            feedbackText: latestFeedback.feedbackText,
            rating: latestFeedback.rating,
          });
        }
      } catch (err) {
        console.error('Error fetching existing feedback:', err);
        setError('Failed to load existing feedback.');
      }
    }
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!feedbackStudent || !selectedClassId) {
      setError('Student or Class not selected for feedback.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...feedbackFormData,
        studentId: feedbackStudent.id,
        classId: selectedClassId,
        educatorId: profile.id, // Ensure educatorId is sent
      };
      await api.post(`/educator/students/${feedbackStudent.id}/classes/${selectedClassId}/feedback`, payload);
      console.log('Feedback submitted successfully');
      setIsFeedbackModalOpen(false);
      // Optionally, refresh feedback for the student or notify success
      // Re-fetch existing feedback to show updated list
      handleGiveFeedback(feedbackStudent); // Re-open to show updated feedback or close and re-fetch student list
    } catch (err) {
      console.error('Error submitting feedback:', err.response?.data || err.message);
      setError('Failed to submit feedback: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };


  if (loading && !profile) { // Only show full loading if initial profile data isn't loaded
    return <div className="text-center py-8 text-gray-700">Loading educator dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Educator Dashboard</h1>

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
                  {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'E'}
                </div>
              )}
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong className="text-blue-700">Name:</strong> {profile.firstName} {profile.lastName}</p>
              <p><strong className="text-blue-700">Username:</strong> {profile.username}</p>
              <p><strong className="text-blue-700">Email:</strong> {profile.email}</p>
              <p><strong className="text-blue-700">Qualification:</strong> {profile.qualification || 'N/A'}</p>
              <p><strong className="text-blue-700">Experience:</strong> {profile.experienceYears} years</p>
              <p><strong className="text-blue-700">Subject Taught:</strong> {profile.subjectName || 'N/A'}</p>
              <p><strong className="text-blue-700">Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
              <p><strong className="text-blue-700">Address:</strong> {profile.address || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Profile information not available.</p>
        )}
      </div>

      {/* Classes Taught Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Classes</h2>
        {classesTaught.length > 0 ? (
          <div>
            <label htmlFor="selectClass" className="block text-lg font-medium text-gray-700 mb-2">Select a Class:</label>
            <select
              id="selectClass"
              value={selectedClassId}
              onChange={handleClassChange}
              className="mt-1 block w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-md shadow-sm p-2"
            >
              {classesTaught.map((clazz) => (
                <option key={clazz.id} value={clazz.id}>
                  {clazz.className} ({clazz.classCode})
                </option>
              ))}
            </select>

            {selectedClassId && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Students in {classesTaught.find(c => c.id === selectedClassId)?.className}</h3>
                {loading && studentsInClass.length === 0 ? (
                  <div className="text-center py-4 text-gray-700">Loading students...</div>
                ) : studentsInClass.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Grade</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentsInClass.map((student) => (
                            <tr key={student.id}>
                              <td className="py-4 px-6 whitespace-nowrap">{`${student.firstName} ${student.lastName}`}</td>
                              <td className="py-4 px-6 whitespace-nowrap">{student.email}</td>
                              <td className="py-4 px-6 whitespace-nowrap">{student.grade || 'N/A'}</td>
                              <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleViewStudentDetail(student.id)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  title="View Student Details"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button
                                  onClick={() => handleGiveFeedback(student)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Give/Edit Feedback"
                                >
                                  <FontAwesomeIcon icon={faCommentMedical} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Student Pagination Controls */}
                    {studentTotalPages > 1 && (
                      <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                          onClick={() => handleStudentPageChange(studentPage - 1)}
                          disabled={studentPage === 0 || loading}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-gray-700">
                          Page {studentPage + 1} of {studentTotalPages}
                        </span>
                        <button
                          onClick={() => handleStudentPageChange(studentPage + 1)}
                          disabled={studentPage === studentTotalPages - 1 || loading}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">No students found in this class.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">You are not currently assigned to any classes.</p>
        )}
      </div>

      {/* Student Detail Modal */}
      <Modal isOpen={isStudentDetailModalOpen} onClose={() => setIsStudentDetailModalOpen(false)} title="Student Details">
        {currentStudentDetail ? (
          <div className="space-y-4 text-gray-700">
            {currentStudentDetail.profileImageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={`${api.defaults.baseURL}${currentStudentDetail.profileImageUrl}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-300"
                />
              </div>
            )}
            <p><strong>ID:</strong> {currentStudentDetail.id}</p>
            <p><strong>Username:</strong> {currentStudentDetail.username}</p>
            <p><strong>Name:</strong> {currentStudentDetail.firstName} {currentStudentDetail.lastName}</p>
            <p><strong>Email:</strong> {currentStudentDetail.email}</p>
            <p><strong>Date of Birth:</strong> {currentStudentDetail.dateOfBirth}</p>
            <p><strong>Gender:</strong> {currentStudentDetail.gender}</p>
            <p><strong>Phone:</strong> {currentStudentDetail.phoneNumber}</p>
            <p><strong>Address:</strong> {currentStudentDetail.address}</p>
            <p><strong>Enrollment Date:</strong> {currentStudentDetail.enrollmentDate}</p>
            <p><strong>Grade:</strong> {currentStudentDetail.grade}</p>
            <p><strong>Role:</strong> {currentStudentDetail.role}</p>
            <p><strong>Class ID:</strong> {currentStudentDetail.classId || 'N/A'}</p>
            <p><strong>Subject IDs:</strong> {currentStudentDetail.subjectIds && currentStudentDetail.subjectIds.length > 0 ? currentStudentDetail.subjectIds.join(', ') : 'N/A'}</p>
          </div>
        ) : (
          <p>Loading student details...</p>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} title={`Feedback for ${feedbackStudent?.firstName} ${feedbackStudent?.lastName}`}>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700">Feedback Text</label>
            <textarea
              id="feedbackText"
              name="feedbackText"
              value={feedbackFormData.feedbackText}
              onChange={handleFeedbackFormChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={feedbackFormData.rating}
              onChange={handleFeedbackFormChange}
              min="1"
              max="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsFeedbackModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>

        {existingFeedback.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Previous Feedback</h3>
            <div className="space-y-4">
              {existingFeedback.map((item) => (
                <div key={item.id} className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50">
                  <p><strong className="text-blue-700">Rating:</strong> {item.rating}/5 <FontAwesomeIcon icon={faStar} className="text-yellow-500 ml-1" /></p>
                  <p className="mt-2 text-gray-800">{item.feedbackText}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {new Date(item.feedbackDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EducatorDashboard;
