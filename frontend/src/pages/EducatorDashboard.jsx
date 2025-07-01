// src/pages/EducatorDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Your Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCommentMedical,
  faEdit,
  faStar,
  faUserCircle, // For profile section
  faChalkboardTeacher, // For classes section
  faCalendarAlt, // For date fields
  faPhone, // For phone number
  faMapMarkerAlt, // For address
  faVenusMars, // For gender
  faBook, // For subject
  faGraduationCap, // For qualification/grade
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/common/Modal"; // Reusing the Modal component

const EducatorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [classesTaught, setClassesTaught] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination for students in class
  const [studentPage, setStudentPage] = useState(0);
  const [studentSize, setStudentSize] = useState(10);
  const [studentTotalPages, setStudentTotalPages] = useState(0);

  // State for Student Details Modal
  const [isStudentDetailModalOpen, setIsStudentDetailModalOpen] =
    useState(false);
  const [currentStudentDetail, setCurrentStudentDetail] = useState(null);

  // State for Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackStudent, setFeedbackStudent] = useState(null); // Student for whom feedback is being given
  const [feedbackFormData, setFeedbackFormData] = useState({
    feedbackText: "",
    rating: 0,
  });
  const [existingFeedback, setExistingFeedback] = useState([]); // Feedback given by this educator to this student in this class

  // Helper to get class name from ID (for student detail modal)
  const getClassName = useCallback(
    (classId) => {
      const clazz = classesTaught.find((c) => c.id === classId);
      return clazz ? `${clazz.className} (${clazz.classCode})` : "N/A";
    },
    [classesTaught]
  );

  // Helper to get subject names from IDs (for student detail modal)
  const getSubjectNames = useCallback((subjectIds) => {
    if (!subjectIds || subjectIds.length === 0) return "N/A";
    // Assuming allSubjects is fetched somewhere or passed down if needed for lookup
    // For now, if StudentDto doesn't include subject names, this will show IDs.
    // If you have a global list of subjects, you'd use that here.
    // For this example, we'll assume subject names are directly available in StudentDto or we fetch all subjects.
    // Let's add a state for allSubjects in EducatorDashboard if not already there, similar to StudentDashboard.
    // For now, just display IDs if names aren't available.
    return subjectIds.join(", "); // Fallback to showing IDs
  }, []); // No dependency on allSubjects for now, as it's not fetched globally here.

  // --- Fetch Educator Data (Profile and Classes) ---
  const fetchEducatorData = async () => {
    setLoading(true);
    setError("");
    try {
      const [profileResponse, classesResponse] = await Promise.all([
        api.get("/educator/profile"),
        api.get("/educator/classes"),
      ]);
      setProfile(profileResponse.data);
      setClassesTaught(classesResponse.data);
      if (classesResponse.data.length > 0) {
        setSelectedClassId(classesResponse.data[0].id); // Automatically select the first class
      }
    } catch (err) {
      console.error("Error fetching educator dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Students in Selected Class ---
  const fetchStudentsInClass = useCallback(
    async (classId, pageNum = studentPage) => {
      if (!classId) {
        setStudentsInClass([]);
        setStudentTotalPages(0);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await api.get(
          `/educator/classes/${classId}/students`,
          {
            params: { page: pageNum, size: studentSize },
          }
        );
        setStudentsInClass(response.data.content);
        setStudentTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(`Error fetching students for class ${classId}:`, err);
        setError("Failed to fetch students for the selected class.");
        setStudentsInClass([]);
      } finally {
        setLoading(false);
      }
    },
    [studentPage, studentSize]
  ); // Dependency on studentPage and studentSize

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
    setError("");
    try {
      const response = await api.get(`/educator/students/${studentId}`);
      setCurrentStudentDetail(response.data);
      setIsStudentDetailModalOpen(true);
    } catch (err) {
      console.error("Error fetching student detail:", err);
      setError("Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleGiveFeedback = async (student) => {
    setFeedbackStudent(student);
    setFeedbackFormData({ feedbackText: "", rating: 0 });
    setExistingFeedback([]); // Clear previous feedback

    if (selectedClassId && student.id) {
      try {
        const response = await api.get(
          `/educator/students/${student.id}/classes/${selectedClassId}/feedback`
        );
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
        console.error("Error fetching existing feedback:", err);
        setError("Failed to load existing feedback.");
      }
    }
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!feedbackStudent || !selectedClassId || !profile) {
      setError("Student, Class, or Educator profile not loaded for feedback.");
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
      await api.post(
        `/educator/students/${feedbackStudent.id}/classes/${selectedClassId}/feedback`,
        payload
      );
      console.log("Feedback submitted successfully");
      setIsFeedbackModalOpen(false);
      // Re-fetch existing feedback to show updated list
      handleGiveFeedback(feedbackStudent); // Re-open to show updated feedback or close and re-fetch student list
    } catch (err) {
      console.error(
        "Error submitting feedback:",
        err.response?.data || err.message
      );
      setError(
        "Failed to submit feedback: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    // Only show full loading if initial profile data isn't loaded
    return (
      <div className="text-center py-8 text-blue-600 text-xl font-semibold">
        Loading educator dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 text-xl font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center border-b-4 border-blue-200 pb-4">
        Educator Dashboard
      </h1>

      {/* Profile Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon icon={faUserCircle} className="mr-3 text-blue-600" />{" "}
          My Profile
        </h2>
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            {/* Details Section (left) */}
            <div className="space-y-3 text-gray-700 md:col-span-2 order-2 md:order-1">
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                  Name:
                </strong>{" "}
                {profile.firstName} {profile.lastName}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                  Username:
                </strong>{" "}
                {profile.username}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                  Qualification:
                </strong>{" "}
                {profile.qualification || "N/A"}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faBook} className="mr-2" />
                  Subject Taught:
                </strong>{" "}
                {profile.subjectName || "N/A"}
              </p>{" "}
              {/* Added icon */}
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Hire Date:
                </strong>{" "}
                {profile.hireDate || "N/A"}
              </p>{" "}
              {/* Added icon */}
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Date of Birth:
                </strong>{" "}
                {profile.dateOfBirth || "N/A"}
              </p>{" "}
              {/* Added icon */}
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                  Gender:
                </strong>{" "}
                {profile.gender || "N/A"}
              </p>{" "}
              {/* Added icon */}
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  Phone:
                </strong>{" "}
                {profile.phoneNumber || "N/A"}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Address:
                </strong>{" "}
                {profile.address || "N/A"}
              </p>
            </div>
            {/* Image Section (right) */}
            <div className="flex justify-center md:col-span-1 order-1 md:order-2">
              {profile.profileImageUrl ? (
                <img
                  src={`${api.defaults.baseURL}${profile.profileImageUrl}`}
                  alt="Profile"
                  className="w-40 h-41 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-42 h-42 bg-blue-100 flex items-center justify-center text-blue-600 text-6xl font-bold shadow-lg">
                  {profile.firstName
                    ? profile.firstName.charAt(0).toUpperCase()
                    : "E"}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            Profile information not available.
          </p>
        )}
      </div>

      {/* Classes Taught Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-green-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon
            icon={faChalkboardTeacher}
            className="mr-3 text-green-600"
          />{" "}
          My Classes
        </h2>
        {classesTaught.length > 0 ? (
          <div>
            <label
              htmlFor="selectClass"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Select a Class:
            </label>
            <select
              id="selectClass"
              value={selectedClassId}
              onChange={handleClassChange}
              className="mt-1 block w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
            >
              {classesTaught.map((clazz) => (
                <option key={clazz.id} value={clazz.id}>
                  {clazz.className} ({clazz.classCode})
                </option>
              ))}
            </select>

            {selectedClassId && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Students in{" "}
                  {
                    classesTaught.find((c) => c.id === selectedClassId)
                      ?.className
                  }
                </h3>
                {loading && studentsInClass.length === 0 ? (
                  <div className="text-center py-4 text-blue-600">
                    Loading students...
                  </div>
                ) : studentsInClass.length > 0 ? (
                  <>
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                              Grade
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {studentsInClass.map((student) => (
                            <tr
                              key={student.id}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="py-4 px-6 whitespace-nowrap text-gray-800">{`${student.firstName} ${student.lastName}`}</td>
                              <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                {student.email}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                {student.grade || "N/A"}
                              </td>
                              <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleViewStudentDetail(student.id)
                                  }
                                  className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-200"
                                  title="View Student Details"
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-lg"
                                  />
                                </button>
                                <button
                                  onClick={() => handleGiveFeedback(student)}
                                  className="text-green-600 hover:text-green-800 transition-colors duration-200"
                                  title="Give/Edit Feedback"
                                >
                                  <FontAwesomeIcon
                                    icon={faCommentMedical}
                                    className="text-lg"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Student Pagination Controls */}
                    {studentTotalPages > 1 && (
                      <div className="flex justify-center items-center mt-6 space-x-3">
                        <button
                          onClick={() =>
                            handleStudentPageChange(studentPage - 1)
                          }
                          disabled={studentPage === 0 || loading}
                          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                        >
                          Previous
                        </button>
                        <span className="text-gray-700 font-medium">
                          Page {studentPage + 1} of {studentTotalPages}
                        </span>
                        <button
                          onClick={() =>
                            handleStudentPageChange(studentPage + 1)
                          }
                          disabled={
                            studentPage === studentTotalPages - 1 || loading
                          }
                          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No students found in this class.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You are not currently assigned to any classes.
          </p>
        )}
      </div>

      {/* Student Detail Modal */}
      <Modal
        isOpen={isStudentDetailModalOpen}
        onClose={() => setIsStudentDetailModalOpen(false)}
        title="Student Details"
      >
        {currentStudentDetail ? (
          <div className="space-y-4 text-gray-700 text-base">
            {currentStudentDetail.profileImageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={`${api.defaults.baseURL}${currentStudentDetail.profileImageUrl}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover shadow-md" // Adjusted styling
                />
              </div>
            )}
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                ID:
              </strong>{" "}
              {currentStudentDetail.id}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                Username:
              </strong>{" "}
              {currentStudentDetail.username}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                Name:
              </strong>{" "}
              {currentStudentDetail.firstName} {currentStudentDetail.lastName}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                Email:
              </strong>{" "}
              {currentStudentDetail.email}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Date of Birth:
              </strong>{" "}
              {currentStudentDetail.dateOfBirth || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                Gender:
              </strong>{" "}
              {currentStudentDetail.gender || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Phone:
              </strong>{" "}
              {currentStudentDetail.phoneNumber || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Address:
              </strong>{" "}
              {currentStudentDetail.address || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Enrollment Date:
              </strong>{" "}
              {currentStudentDetail.enrollmentDate || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Grade:
              </strong>{" "}
              {currentStudentDetail.grade || "N/A"}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                Role:
              </strong>{" "}
              {currentStudentDetail.role}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                Class:
              </strong>{" "}
              {getClassName(currentStudentDetail.classId)}
            </p>
            <p>
              <strong className="text-blue-700">
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                Subjects:
              </strong>{" "}
              {getSubjectNames(currentStudentDetail.subjectIds)}
            </p>
          </div>
        ) : (
          <p>Loading student details...</p>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title={`Feedback for ${feedbackStudent?.firstName} ${feedbackStudent?.lastName}`}
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-5">
          {" "}
          {/* Increased space-y */}
          <div>
            <label
              htmlFor="feedbackText"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Feedback Text
            </label>
            <textarea
              id="feedbackText"
              name="feedbackText"
              value={feedbackFormData.feedbackText}
              onChange={handleFeedbackFormChange}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating (1-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={feedbackFormData.rating}
              onChange={handleFeedbackFormChange}
              min="1"
              max="5"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-600 text-xs italic mb-2">{error}</p>}{" "}
          {/* Changed text-red-500 to text-red-600 */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>

        {existingFeedback.length > 0 && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Previous Feedback
            </h3>
            <div className="space-y-4">
              {existingFeedback.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 p-5 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-200"
                >
                  {" "}
                  {/* Increased padding, added rounded-lg, shadow-sm, hover effect */}
                  <p>
                    <strong className="text-blue-700">Rating:</strong>{" "}
                    {item.rating}/5{" "}
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-500 ml-1"
                    />
                  </p>
                  <p className="mt-2 text-gray-800">{item.feedbackText}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Date: {new Date(item.feedbackDate).toLocaleDateString()}
                  </p>
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
