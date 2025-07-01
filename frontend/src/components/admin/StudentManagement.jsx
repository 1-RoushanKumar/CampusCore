// src/components/admin/StudentManagement.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Your Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modal"; // A simple Modal component (create this if you don't have one)

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // States for dynamic dropdowns
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null); // Null for create, object for edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Only for creation, not ideal for update without backend hash check
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    grade: "",
    classId: "", // For single class assignment
    subjectIds: [], // For multiple subjects
  });
  const [profileImage, setProfileImage] = useState(null); // File object for upload
  const [profileImageUrlPreview, setProfileImageUrlPreview] = useState(""); // For displaying current/new image

  // State for View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);

  // --- Fetch Students ---
  const fetchStudents = async (currentPage = page) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/students`, {
        params: { page: currentPage, size },
      });
      setStudents(response.data.content); // Assuming 'content' holds the list of students
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Classes and Subjects for dropdowns ---
  const fetchClassesAndSubjects = async () => {
    try {
      const [classesResponse, subjectsResponse] = await Promise.all([
        api.get("/admin/classes", { params: { page: 0, size: 1000 } }), // Fetch all classes
        api.get("/admin/subjects", { params: { page: 0, size: 1000 } }), // Fetch all subjects
      ]);
      setAllClasses(classesResponse.data.content);
      setAllSubjects(subjectsResponse.data.content);
    } catch (err) {
      console.error("Error fetching classes or subjects:", err);
      // Don't set global error, just log for now as it might not block student management entirely
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClassesAndSubjects(); // Fetch classes and subjects on component mount
  }, [page, size]); // Refetch students when page or size changes

  // --- Handle Form Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setProfileImageUrlPreview(URL.createObjectURL(file));
    } else {
      setProfileImageUrlPreview(currentStudent?.profileImageUrl || "");
    }
  };

  const handleSubjectIdsChange = (e) => {
    const { options } = e.target;
    const selectedSubjects = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedSubjects.push(Number(options[i].value)); // Convert to number
      }
    }
    setFormData((prev) => ({ ...prev, subjectIds: selectedSubjects }));
  };

  // --- Open Modals ---
  const handleAddStudent = () => {
    setCurrentStudent(null); // Clear for new student
    setFormData({
      // Reset form data
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      address: "",
      grade: "",
      classId: "",
      subjectIds: [],
    });
    setProfileImage(null);
    setProfileImageUrlPreview("");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setFormData({
      username: student.username,
      email: student.email,
      password: "", // Don't pre-fill password for security
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth || "", // Ensure date is correctly formatted for input type="date"
      gender: student.gender || "",
      phoneNumber: student.phoneNumber || "",
      address: student.address || "",
      grade: student.grade || "",
      classId: student.classId || "",
      subjectIds: student.subjectIds || [],
    });
    setProfileImage(null); // Clear file input
    setProfileImageUrlPreview(student.profileImageUrl || ""); // Show existing image
    setIsModalOpen(true);
  };

  const handleViewStudent = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/students/${id}`);
      setStudentDetails(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching student details:", err);
      setError("Failed to fetch student details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Create/Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isCreating = currentStudent === null;

    // Create FormData for multipart request
    const formDataToSend = new FormData();

    // Append the student DTO as a JSON blob
    // Exclude password for updates if it's empty
    const studentDto = { ...formData };
    if (!isCreating) {
      delete studentDto.password; // Don't send empty password on update
    }
    // Ensure classId is null if empty string
    if (studentDto.classId === "") {
      studentDto.classId = null;
    }
    // Ensure subjectIds is an empty array if null
    if (studentDto.subjectIds === null) {
      studentDto.subjectIds = [];
    }

    formDataToSend.append(
      "student",
      new Blob([JSON.stringify(studentDto)], { type: "application/json" })
    );

    // Append profile image if selected
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }
    // If no new image is selected and there was an existing one, don't touch the profileImage part.
    // If the user explicitly cleared the image, you might need a separate mechanism.
    // For now, if profileImage is null and profileImageUrlPreview is empty, it means no change.
    // If profileImage is null but profileImageUrlPreview exists, it means no new upload, keep existing.

    try {
      if (isCreating) {
        await api.post("/admin/students", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Student created successfully");
      } else {
        await api.put(`/admin/students/${currentStudent.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Student updated successfully");
      }
      setIsModalOpen(false);
      fetchStudents(); // Refresh list
    } catch (err) {
      console.error("Error saving student:", err.response?.data || err.message);
      setError(
        "Failed to save student: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Student ---
  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setLoading(true);
      setError("");
      try {
        await api.delete(`/admin/students/${id}`);
        console.log("Student deleted successfully");
        fetchStudents(); // Refresh list
      } catch (err) {
        console.error("Error deleting student:", err);
        setError("Failed to delete student.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Pagination Handlers ---
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading && students.length === 0) {
    return <div className="text-center py-8">Loading students...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Students</h2>
        <button
          onClick={handleAddStudent}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Student
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {students.length === 0 && !loading ? (
        <p className="text-center text-gray-600">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Username
                </th>
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
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {student.profileImageUrl ? (
                      <img
                        src={`${api.defaults.baseURL}${student.profileImageUrl}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {student.username}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{`${student.firstName} ${student.lastName}`}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {student.email}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {student.grade || "N/A"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewStudent(student.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0 || loading}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages - 1 || loading}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentStudent ? "Edit Student" : "Add New Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          {!currentStudent && ( // Password field only for new student creation
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!currentStudent}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700"
            >
              Grade
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="classId"
              className="block text-sm font-medium text-gray-700"
            >
              Class
            </label>
            <select
              id="classId"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Class</option>
              {allClasses.map((clazz) => (
                <option key={clazz.id} value={clazz.id}>
                  {clazz.className} ({clazz.classCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="subjectIds"
              className="block text-sm font-medium text-gray-700"
            >
              Subjects (Select multiple)
            </label>
            <select
              multiple={true}
              id="subjectIds"
              name="subjectIds"
              value={formData.subjectIds}
              onChange={handleSubjectIdsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
            >
              {allSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {profileImageUrlPreview && (
              <img
                src={
                  profileImageUrlPreview.startsWith("blob:")
                    ? profileImageUrlPreview
                    : `${api.defaults.baseURL}${profileImageUrlPreview}`
                }
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Details"
      >
        {studentDetails ? (
          <div className="space-y-4 text-gray-700">
            {studentDetails.profileImageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={`${api.defaults.baseURL}${studentDetails.profileImageUrl}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-300"
                />
              </div>
            )}
            <p>
              <strong>ID:</strong> {studentDetails.id}
            </p>
            <p>
              <strong>Username:</strong> {studentDetails.username}
            </p>
            <p>
              <strong>Name:</strong> {studentDetails.firstName}{" "}
              {studentDetails.lastName}
            </p>
            <p>
              <strong>Email:</strong> {studentDetails.email}
            </p>
            <p>
              <strong>Date of Birth:</strong> {studentDetails.dateOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {studentDetails.gender}
            </p>
            <p>
              <strong>Phone:</strong> {studentDetails.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {studentDetails.address}
            </p>
            <p>
              <strong>Enrollment Date:</strong> {studentDetails.enrollmentDate}
            </p>
            <p>
              <strong>Grade:</strong> {studentDetails.grade}
            </p>
            <p>
              <strong>Role:</strong> {studentDetails.role}
            </p>
            <p>
              <strong>Class ID:</strong> {studentDetails.classId || "N/A"}
            </p>
            <p>
              <strong>Subject IDs:</strong>{" "}
              {studentDetails.subjectIds && studentDetails.subjectIds.length > 0
                ? studentDetails.subjectIds.join(", ")
                : "N/A"}
            </p>
          </div>
        ) : (
          <p>Loading student details...</p>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagement;
