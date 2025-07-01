// src/components/admin/EducatorManagement.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Your Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modal"; // Reusing the Modal component

const EducatorManagement = () => {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // States for dynamic dropdowns (Classes and Subjects)
  const [allClasses, setAllClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEducator, setCurrentEducator] = useState(null); // Null for create, object for edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    hireDate: "",
    qualification: "",
    experienceYears: "",
    classIds: [], // List of class IDs
    subjectId: "", // Single subject ID
  });
  const [profileImage, setProfileImage] = useState(null); // File object for upload
  const [profileImageUrlPreview, setProfileImageUrlPreview] = useState(""); // For displaying current/new image

  // State for View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [educatorDetails, setEducatorDetails] = useState(null);

  // --- Fetch Educators ---
  const fetchEducators = async (currentPage = page) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/educators`, {
        params: { page: currentPage, size },
      });
      setEducators(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching educators:", err);
      setError("Failed to fetch educators. Please try again.");
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
      console.error("Error fetching classes or subjects for dropdowns:", err);
      // Log the error but don't block the main component loading
    }
  };

  useEffect(() => {
    fetchEducators();
    fetchClassesAndSubjects(); // Fetch classes and subjects on component mount
  }, [page, size]); // Refetch educators when page or size changes

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
      setProfileImageUrlPreview(currentEducator?.profileImageUrl || "");
    }
  };

  const handleClassIdsChange = (e) => {
    const { options } = e.target;
    const selectedClasses = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedClasses.push(Number(options[i].value)); // Convert to number
      }
    }
    setFormData((prev) => ({ ...prev, classIds: selectedClasses }));
  };

  // --- Open Modals ---
  const handleAddEducator = () => {
    setCurrentEducator(null); // Clear for new educator
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
      hireDate: "",
      qualification: "",
      experienceYears: "",
      classIds: [],
      subjectId: "",
    });
    setProfileImage(null);
    setProfileImageUrlPreview("");
    setIsModalOpen(true);
  };

  const handleEditEducator = (educator) => {
    setCurrentEducator(educator);
    setFormData({
      username: educator.username,
      email: educator.email,
      password: "", // Don't pre-fill password for security
      firstName: educator.firstName,
      lastName: educator.lastName,
      dateOfBirth: educator.dateOfBirth || "",
      gender: educator.gender || "",
      phoneNumber: educator.phoneNumber || "",
      address: educator.address || "",
      hireDate: educator.hireDate || "",
      qualification: educator.qualification || "",
      experienceYears: educator.experienceYears || "",
      classIds: educator.classIds || [],
      subjectId: educator.subjectId || "",
    });
    setProfileImage(null); // Clear file input
    setProfileImageUrlPreview(educator.profileImageUrl || ""); // Show existing image
    setIsModalOpen(true);
  };

  const handleViewEducator = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/educators/${id}`);
      setEducatorDetails(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching educator details:", err);
      setError("Failed to fetch educator details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Create/Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isCreating = currentEducator === null;
    const formDataToSend = new FormData();

    const educatorDto = { ...formData };
    if (!isCreating) {
      delete educatorDto.password; // Don't send empty password on update
    }
    // Ensure subjectId is null if empty string
    if (educatorDto.subjectId === "") {
      educatorDto.subjectId = null;
    }
    // Ensure classIds is an empty array if null
    if (educatorDto.classIds === null) {
      educatorDto.classIds = [];
    }

    formDataToSend.append(
      "educator",
      new Blob([JSON.stringify(educatorDto)], { type: "application/json" })
    );

    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }

    try {
      if (isCreating) {
        await api.post("/admin/educators", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Educator created successfully");
      } else {
        await api.put(
          `/admin/educators/${currentEducator.id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Educator updated successfully");
      }
      setIsModalOpen(false);
      fetchEducators(); // Refresh list
    } catch (err) {
      console.error(
        "Error saving educator:",
        err.response?.data || err.message
      );
      setError(
        "Failed to save educator: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Educator ---
  const handleDeleteEducator = async (id) => {
    if (window.confirm("Are you sure you want to delete this educator?")) {
      setLoading(true);
      setError("");
      try {
        await api.delete(`/admin/educators/${id}`);
        console.log("Educator deleted successfully");
        fetchEducators(); // Refresh list
      } catch (err) {
        console.error("Error deleting educator:", err);
        setError("Failed to delete educator.");
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

  if (loading && educators.length === 0) {
    return <div className="text-center py-8">Loading educators...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Educators</h2>
        <button
          onClick={handleAddEducator}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Educator
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {educators.length === 0 && !loading ? (
        <p className="text-center text-gray-600">No educators found.</p>
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
                  Subject
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {educators.map((educator) => (
                <tr key={educator.id}>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {educator.profileImageUrl ? (
                      <img
                        src={`${api.defaults.baseURL}${educator.profileImageUrl}`}
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
                    {educator.username}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">{`${educator.firstName} ${educator.lastName}`}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {educator.email}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {educator.subjectName || "N/A"}
                  </td>
                  {/* Display subject name */}
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewEducator(educator.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleEditEducator(educator)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteEducator(educator.id)}
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

      {/* Create/Edit Educator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEducator ? "Edit Educator" : "Add New Educator"}
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
          {!currentEducator && ( // Password field only for new educator creation
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
                required={!currentEducator}
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
              htmlFor="hireDate"
              className="block text-sm font-medium text-gray-700"
            >
              Hire Date
            </label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="qualification"
              className="block text-sm font-medium text-gray-700"
            >
              Qualification
            </label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="experienceYears"
              className="block text-sm font-medium text-gray-700"
            >
              Experience (Years)
            </label>
            <input
              type="number"
              id="experienceYears"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label
              htmlFor="subjectId"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Taught
            </label>
            <select
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Subject</option>
              {allSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="classIds"
              className="block text-sm font-medium text-gray-700"
            >
              Classes (Select multiple)
            </label>
            <select
              multiple={true}
              id="classIds"
              name="classIds"
              value={formData.classIds}
              onChange={handleClassIdsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
            >
              {allClasses.map((clazz) => (
                <option key={clazz.id} value={clazz.id}>
                  {clazz.className} ({clazz.classCode})
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
              {loading ? "Saving..." : "Save Educator"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Educator Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Educator Details"
      >
        {educatorDetails ? (
          <div className="space-y-4 text-gray-700">
            {educatorDetails.profileImageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={`${api.defaults.baseURL}${educatorDetails.profileImageUrl}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-300"
                />
              </div>
            )}
            <p>
              <strong>ID:</strong> {educatorDetails.id}
            </p>
            <p>
              <strong>Username:</strong> {educatorDetails.username}
            </p>
            <p>
              <strong>Name:</strong> {educatorDetails.firstName}{" "}
              {educatorDetails.lastName}
            </p>
            <p>
              <strong>Email:</strong> {educatorDetails.email}
            </p>
            <p>
              <strong>Date of Birth:</strong> {educatorDetails.dateOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {educatorDetails.gender}
            </p>
            <p>
              <strong>Phone:</strong> {educatorDetails.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {educatorDetails.address}
            </p>
            <p>
              <strong>Hire Date:</strong> {educatorDetails.hireDate}
            </p>
            <p>
              <strong>Qualification:</strong> {educatorDetails.qualification}
            </p>
            <p>
              <strong>Experience:</strong> {educatorDetails.experienceYears}{" "}
              years
            </p>
            <p>
              <strong>Role:</strong> {educatorDetails.role}
            </p>
            <p>
              <strong>Subject Taught:</strong>{" "}
              {educatorDetails.subjectName || "N/A"}
            </p>
            <p>
              <strong>Classes:</strong>{" "}
              {educatorDetails.classIds && educatorDetails.classIds.length > 0
                ? educatorDetails.classIds.join(", ")
                : "N/A"}
            </p>
          </div>
        ) : (
          <p>Loading educator details...</p>
        )}
      </Modal>
    </div>
  );
};

export default EducatorManagement;
