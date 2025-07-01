// src/pages/StudentDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Your Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faGraduationCap,
  faBookOpen,
  faComments,
  faCalendarAlt,
  faPhone,
  faMapMarkerAlt,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons"; // Added more icons

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [enrolledClass, setEnrolledClass] = useState(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]); // New state for enrolled subjects
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for dynamic dropdowns (to resolve IDs to names)
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]); // Still needed to filter enrolledSubjects from all subjects

  // Helper to get educator names from a list of educator objects (SubjectDto.EducatorInfo)
  const getEducatorNames = useCallback((educators) => {
    if (!educators || educators.length === 0) return "N/A";
    return educators
      .map((educator) => `${educator.firstName} ${educator.lastName}`)
      .join(", ");
  }, []); // No dependencies needed as it operates on the passed list

  // Helper to get class name from ID (if not directly provided in profile DTO)
  const getClassName = useCallback(
    (classId) => {
      const clazz = allClasses.find((c) => c.id === classId);
      return clazz ? `${clazz.className} (${clazz.classCode})` : "N/A";
    },
    [allClasses]
  );

  // Helper to get subject names from IDs (if not directly provided in profile DTO)
  // This helper is not strictly needed for rendering enrolledSubjects directly,
  // but might be useful elsewhere if you only have subjectIds and need names.
  const getSubjectNames = useCallback(
    (subjectIds) => {
      if (!subjectIds || subjectIds.length === 0) return "N/A";
      return subjectIds
        .map((id) => {
          const subject = allSubjects.find((s) => s.id === id);
          return subject ? subject.subjectName : null;
        })
        .filter(Boolean) // Remove nulls
        .join(", ");
    },
    [allSubjects]
  );

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all classes and subjects first for lookup (using student-accessible endpoints)
        const [classesResponse, subjectsResponse] = await Promise.all([
          api.get("/student/classes/all"), // Using the new student-accessible endpoint
          api.get("/student/subjects/all"), // Using the new student-accessible endpoint
        ]);
        setAllClasses(classesResponse.data); // Assuming data is directly the list
        setAllSubjects(subjectsResponse.data); // Assuming data is directly the list

        // Fetch Student Profile
        const profileResponse = await api.get("/student/profile");
        setProfile(profileResponse.data);

        // Fetch Enrolled Class
        try {
          const classResponse = await api.get("/student/enrolled-class");
          setEnrolledClass(classResponse.data);
        } catch (classErr) {
          if (
            classErr.response &&
            (classErr.response.status === 404 ||
              classErr.response.status === 204)
          ) {
            setEnrolledClass(null);
            console.warn("No enrolled class found for this student.");
          } else {
            console.error("Error fetching enrolled class:", classErr);
            setError("Failed to fetch enrolled class data.");
          }
        }

        // Fetch Enrolled Subjects (assuming the profile DTO contains subjectIds)
        if (profileResponse.data.subjectIds && subjectsResponse.data) {
          const subjectsForStudent = subjectsResponse.data.filter((subject) =>
            profileResponse.data.subjectIds.includes(subject.id)
          );
          setEnrolledSubjects(subjectsForStudent);
        }

        // Fetch Feedback
        const feedbackResponse = await api.get("/student/feedback");
        setFeedback(feedbackResponse.data);
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="text-center py-8 text-blue-600 text-xl font-semibold">
        Loading student dashboard...
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
        Student Dashboard
      </h1>

      {/* Profile Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon icon={faUserCircle} className="mr-3 text-blue-600" />{" "}
          My Profile
        </h2>
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {" "}
            {/* Changed gap-8 to gap-4 */}
            {/* Details Section (moved to left, md:col-span-2) */}
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
                  Grade:
                </strong>{" "}
                {profile.grade || "N/A"}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Enrollment Date:
                </strong>{" "}
                {profile.enrollmentDate || "N/A"}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Date of Birth:
                </strong>{" "}
                {profile.dateOfBirth || "N/A"}
              </p>
              <p>
                <strong className="text-blue-700">
                  <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                  Gender:
                </strong>{" "}
                {profile.gender || "N/A"}
              </p>
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
            {/* Image Section (moved to right, md:col-span-1) */}
            <div className="flex justify-center md:col-span-1 order-1 md:order-2">
              {profile.profileImageUrl ? (
                <img
                  src={`${api.defaults.baseURL}${profile.profileImageUrl}`}
                  alt="Profile"
                  className="w-40 h-42 object-cover shadow-lg transition-transform duration-300 hover:scale-105" // Removed rounded-full and border
                />
              ) : (
                <div className="w-42 h-42 bg-blue-100 flex items-center justify-center text-blue-600 text-6xl font-bold shadow-lg">
                  {" "}
                  {/* Removed rounded-full and border */}
                  {profile.firstName
                    ? profile.firstName.charAt(0).toUpperCase()
                    : "S"}
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

      {/* Enrolled Class Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-green-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon
            icon={faGraduationCap}
            className="mr-3 text-green-600"
          />{" "}
          My Enrolled Class
        </h2>
        {enrolledClass ? (
          <div className="space-y-3 text-gray-700">
            <p>
              <strong className="text-green-700">Class Name:</strong>{" "}
              {enrolledClass.className}
            </p>
            <p>
              <strong className="text-green-700">Class Code:</strong>{" "}
              {enrolledClass.classCode}
            </p>
            <p>
              <strong className="text-green-700">Description:</strong>{" "}
              {enrolledClass.description || "N/A"}
            </p>
            <h4 className="font-semibold mt-4 text-green-700">
              Class Educators:
            </h4>
            {enrolledClass.educators && enrolledClass.educators.length > 0 ? (
              <ul className="list-disc list-inside ml-6 space-y-1">
                {enrolledClass.educators.map((educator) => (
                  <li key={educator.id}>
                    {educator.firstName} {educator.lastName} ({educator.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 ml-6">
                No educators assigned to this class.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You are not currently enrolled in a class.
          </p>
        )}
      </div>

      {/* Enrolled Subjects Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-purple-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-purple-600" />{" "}
          My Enrolled Subjects
        </h2>
        {enrolledSubjects && enrolledSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledSubjects.map((subject) => (
              <div
                key={subject.id}
                className="border border-purple-200 p-5 rounded-lg shadow-sm bg-purple-50 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  {subject.subjectName}
                </h3>
                <p className="text-gray-700 text-sm">
                  {subject.description || "No description available."}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong className="text-purple-700">Educators:</strong>{" "}
                  {getEducatorNames(subject.educators)}{" "}
                  {/* Changed to use subject.educators directly */}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            You are not currently enrolled in any subjects.
          </p>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-yellow-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
          <FontAwesomeIcon icon={faComments} className="mr-3 text-yellow-600" />{" "}
          My Feedback
        </h2>
        {feedback && feedback.length > 0 ? (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="border border-yellow-200 p-5 rounded-lg shadow-sm bg-yellow-50 hover:shadow-md transition-shadow duration-200"
              >
                <p className="mb-1">
                  <strong className="text-yellow-700">From Educator:</strong>{" "}
                  {item.educatorFirstName} {item.educatorLastName}
                </p>
                <p className="mb-1">
                  <strong className="text-yellow-700">Class:</strong>{" "}
                  {item.className}
                </p>
                <p className="mb-1">
                  <strong className="text-yellow-700">Rating:</strong>{" "}
                  {item.rating}/5
                </p>
                <p className="mt-3 text-gray-800 italic">
                  "{item.feedbackText}"
                </p>
                <p className="text-xs text-gray-500 mt-3 text-right">
                  Date: {new Date(item.feedbackDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No feedback available yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
