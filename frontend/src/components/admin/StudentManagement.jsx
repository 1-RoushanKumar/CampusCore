// src/components/admin/StudentManagement.jsx
import React, {useState, useEffect, useCallback} from "react";
import api from "../../services/api"; // Your Axios instance
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faTrash,
    faPlus,
    faEye,
    faEraser, // Added for "Clear Image"
    faHome, // For address fields
    faChild, // For parent details
    faPray, // For religion
    faGlobe, // For nationality
    faTags, // For category
    faWheelchair, // For physical handicapped
    faIdBadge, // For Roll Number
    faPhone, // For phone numbers
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
        // NEW: Address Details
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        grade: "",
        classId: "", // For single class assignment
        subjectIds: [], // For multiple subjects
        enrollmentDate: "",
        // NEW: Parent Details
        fatherName: "",
        motherName: "",
        fatherMobileNumber: "",
        motherMobileNumber: "",
        localMobileNumber: "",
        // NEW: More Student Details
        studentHindiName: "",
        religion: "",
        nationality: "",
        category: "",
        physicalHandicapped: false, // Default to false
    });
    const [profileImage, setProfileImage] = useState(null); // File object for upload
    const [profileImageUrlPreview, setProfileImageUrlPreview] = useState(""); // For displaying current/new image
    const [clearProfileImage, setClearProfileImage] = useState(false); // New state to explicitly clear image

    // State for View Details Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [studentDetails, setStudentDetails] = useState(null);

    // Helper to get class name from ID
    const getClassName = useCallback(
        (classId) => {
            const clazz = allClasses.find((c) => c.id === classId);
            return clazz ? `${clazz.className} (${clazz.classCode})` : "N/A";
        },
        [allClasses]
    );

    // Helper to get subject names from IDs
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

    // --- Fetch Students ---
    const fetchStudents = async (currentPage = page) => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/admin/students`, {
                params: {page: currentPage, size},
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
                api.get("/admin/classes", {params: {page: 0, size: 1000}}), // Fetch all classes
                api.get("/admin/subjects", {params: {page: 0, size: 1000}}), // Fetch all subjects
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
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            setProfileImageUrlPreview(URL.createObjectURL(file));
            setClearProfileImage(false); // If new image selected, don't clear
        } else {
            // If file input is cleared manually (e.g., by browser's 'x' button)
            // Restore original preview if in edit mode and no new file
            setProfileImageUrlPreview(currentStudent?.profileImageUrl || "");
        }
    };

    const handleClearImageCheckboxChange = (e) => {
        setClearProfileImage(e.target.checked);
        if (e.target.checked) {
            setProfileImage(null); // Clear file input if checkbox is checked
            setProfileImageUrlPreview(""); // Clear preview
        } else {
            // If unchecking, restore original preview if in edit mode
            setProfileImageUrlPreview(currentStudent?.profileImageUrl || "");
        }
    };

    const handleSubjectIdsChange = (e) => {
        const {options} = e.target;
        const selectedSubjects = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedSubjects.push(Number(options[i].value)); // Convert to number
            }
        }
        setFormData((prev) => ({...prev, subjectIds: selectedSubjects}));
    };

    // --- Open Modals ---
    const handleAddStudent = () => {
        setCurrentStudent(null); // Clear for new student
        setFormData({
            // Reset form data to initial empty/default values
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            phoneNumber: "",
            addressLine1: "", // NEW
            city: "", // NEW
            state: "", // NEW
            pincode: "", // NEW
            country: "", // NEW
            grade: "",
            classId: "",
            subjectIds: [],
            enrollmentDate: new Date().toISOString().split("T")[0], // Automatically set current date
            fatherName: "", // NEW
            motherName: "", // NEW
            fatherMobileNumber: "", // NEW
            motherMobileNumber: "", // NEW
            localMobileNumber: "", // NEW
            studentHindiName: "", // NEW
            religion: "", // NEW
            nationality: "", // NEW
            category: "", // NEW
            physicalHandicapped: false, // NEW
        });
        setProfileImage(null);
        setProfileImageUrlPreview("");
        setClearProfileImage(false); // Reset clear image state
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
            // NEW: Address Details
            addressLine1: student.addressLine1 || "",
            city: student.city || "",
            state: student.state || "",
            pincode: student.pincode || "",
            country: student.country || "",
            grade: student.grade || "",
            classId: student.classId || "",
            subjectIds: student.subjectIds || [],
            enrollmentDate: student.enrollmentDate || "", // Keep existing enrollment date
            // NEW: Parent Details
            fatherName: student.fatherName || "",
            motherName: student.motherName || "",
            fatherMobileNumber: student.fatherMobileNumber || "",
            motherMobileNumber: student.motherMobileNumber || "",
            localMobileNumber: student.localMobileNumber || "",
            // NEW: More Student Details
            studentHindiName: student.studentHindiName || "",
            religion: student.religion || "",
            nationality: student.nationality || "",
            category: student.category || "",
            physicalHandicapped: student.physicalHandicapped || false, // Ensure boolean default
        });
        setProfileImage(null); // Clear file input
        setProfileImageUrlPreview(student.profileImageUrl || ""); // Show existing image
        setClearProfileImage(false); // Reset clear image state
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

        // Prepare student DTO
        const studentDto = {...formData};
        if (!isCreating) {
            delete studentDto.password; // Don't send password on update if not explicitly changed
        }
        // Ensure classId is null if empty string
        if (studentDto.classId === "") {
            studentDto.classId = null;
        }
        // Ensure subjectIds is an empty array if null
        if (studentDto.subjectIds === null) {
            studentDto.subjectIds = [];
        }

        // Handle profile image logic for DTO
        if (clearProfileImage) {
            // If user explicitly wants to clear image, set URL to null in DTO
            studentDto.profileImageUrl = null;
        } else if (
            !profileImage &&
            currentStudent &&
            currentStudent.profileImageUrl
        ) {
            // If no new image selected AND not clearing AND there was an existing image,
            // retain the existing image URL in the DTO.
            studentDto.profileImageUrl = currentStudent.profileImageUrl;
        } else if (!profileImage && !currentStudent) {
            // If creating and no image selected, ensure it's null
            studentDto.profileImageUrl = null;
        }
        // If profileImage is set (new file selected), it will be handled by MultipartFile on backend
        // and the profileImageUrl in DTO will be ignored or overwritten by the backend.

        formDataToSend.append(
            "student",
            new Blob([JSON.stringify(studentDto)], {type: "application/json"})
        );

        // Append profile image file if selected
        if (profileImage) {
            formDataToSend.append("profileImage", profileImage);
        }

        try {
            if (isCreating) {
                await api.post("/admin/students", formDataToSend, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                console.log("Student created successfully");
            } else {
                await api.put(`/admin/students/${currentStudent.id}`, formDataToSend, {
                    headers: {"Content-Type": "multipart/form-data"},
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
        return (
            <div className="text-center py-8 text-blue-600 text-xl">
                Loading students...
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Manage Students</h2>
                <button
                    onClick={handleAddStudent}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md transition duration-200 transform hover:scale-105"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add New Student
                </button>
            </div>

            {error && (
                <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
            )}

            {students.length === 0 && !loading ? (
                <p className="text-center text-gray-600 py-4">No students found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
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
                                Class
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Subjects
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="py-4 px-6 whitespace-nowrap">
                                    {student.profileImageUrl ? (
                                        <img
                                            src={`${api.defaults.baseURL}${student.profileImageUrl}`}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                                            N/A
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                    {student.username}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{`${student.firstName} ${student.lastName}`}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                    {student.email}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                    {getClassName(student.classId)}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">
                                    {getSubjectNames(student.subjectIds)}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewStudent(student.id)}
                                        className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-200"
                                        title="View Details"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="text-lg"/>
                                    </button>
                                    <button
                                        onClick={() => handleEditStudent(student)}
                                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-lg"/>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                        title="Delete"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-lg"/>
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
                <div className="flex justify-center items-center mt-6 space-x-3">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0 || loading}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
            Page {page + 1} of {totalPages}
          </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1 || loading}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
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
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* User Details */}
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Basic Student Details */}
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="studentHindiName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Student Name (Hindi)
                            </label>
                            <input
                                type="text"
                                id="studentHindiName"
                                name="studentHindiName"
                                value={formData.studentHindiName}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                Student Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Address Details */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 col-span-full mb-2">
                                Address Details
                            </h3>
                            <div>
                                <label
                                    htmlFor="addressLine1"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address Line 1
                                </label>
                                <input
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="state"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="pincode"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Academic Details */}
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="enrollmentDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Enrollment Date
                            </label>
                            <input
                                type="date"
                                id="enrollmentDate"
                                name="enrollmentDate"
                                value={formData.enrollmentDate}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 h-32 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {allSubjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.subjectName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Parent Details */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 col-span-full mb-2">
                                Parent / Guardian Details
                            </h3>
                            <div>
                                <label
                                    htmlFor="fatherName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Father's Name
                                </label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    name="fatherName"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="motherName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mother's Name
                                </label>
                                <input
                                    type="text"
                                    id="motherName"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="fatherMobileNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Father's Mobile Number
                                </label>
                                <input
                                    type="text"
                                    id="fatherMobileNumber"
                                    name="fatherMobileNumber"
                                    value={formData.fatherMobileNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="motherMobileNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mother's Mobile Number
                                </label>
                                <input
                                    type="text"
                                    id="motherMobileNumber"
                                    name="motherMobileNumber"
                                    value={formData.motherMobileNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="localMobileNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Local Contact Mobile Number (Student)
                                </label>
                                <input
                                    type="text"
                                    id="localMobileNumber"
                                    name="localMobileNumber"
                                    value={formData.localMobileNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* More Student Details */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 col-span-full mb-2">
                                Additional Student Information
                            </h3>
                            <div>
                                <label
                                    htmlFor="religion"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Religion
                                </label>
                                <input
                                    type="text"
                                    id="religion"
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nationality"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nationality
                                </label>
                                <input
                                    type="text"
                                    id="nationality"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category (e.g., General, OBC, SC, ST)
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="physicalHandicapped"
                                    name="physicalHandicapped"
                                    checked={formData.physicalHandicapped}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="physicalHandicapped"
                                    className="ml-2 block text-sm font-medium text-gray-700"
                                >
                                    Physical Handicapped
                                </label>
                            </div>
                        </div>
                    </div>
                    {" "}
                    {/* End of main grid */}
                    {/* Profile Image Section */}
                    <div className="border-t pt-4 mt-4">
                        <label
                            htmlFor="profileImage"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Profile Image
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            disabled={clearProfileImage} // Disable if clear image is checked
                        />
                        {profileImageUrlPreview && (
                            <img
                                src={
                                    profileImageUrlPreview.startsWith("blob:")
                                        ? profileImageUrlPreview
                                        : `${api.defaults.baseURL}${profileImageUrlPreview}`
                                }
                                alt="Profile Preview"
                                className="mt-3 w-28 h-28 object-cover rounded-full border-2 border-gray-300 shadow-sm"
                            />
                        )}
                        {currentStudent && currentStudent.profileImageUrl && (
                            <div className="mt-3 flex items-center">
                                <input
                                    type="checkbox"
                                    id="clearProfileImage"
                                    checked={clearProfileImage}
                                    onChange={handleClearImageCheckboxChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="clearProfileImage"
                                    className="ml-2 text-sm text-gray-700 flex items-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faEraser}
                                        className="mr-1 text-red-500"
                                    />{" "}
                                    Clear existing image
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
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
                    <div className="space-y-4 text-gray-700 text-base">
                        {studentDetails.profileImageUrl && (
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`${api.defaults.baseURL}${studentDetails.profileImageUrl}`}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-2 border-blue-300 shadow-md"
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
                            {studentDetails.lastName}{" "}
                            {studentDetails.studentHindiName &&
                                `(${studentDetails.studentHindiName})`}
                        </p>
                        <p>
                            <strong>Email:</strong> {studentDetails.email}
                        </p>
                        <p>
                            <strong>Roll Number:</strong> {studentDetails.rollNumber || "N/A"}
                        </p>
                        <p>
                            <strong>Date of Birth:</strong>{" "}
                            {studentDetails.dateOfBirth || "N/A"}
                        </p>
                        <p>
                            <strong>Gender:</strong> {studentDetails.gender || "N/A"}
                        </p>
                        <p>
                            <strong>Student Phone:</strong>{" "}
                            {studentDetails.phoneNumber || "N/A"}
                        </p>
                        <p>
                            <strong>Address:</strong>{" "}
                            {[
                                studentDetails.addressLine1,
                                studentDetails.city,
                                studentDetails.state,
                                studentDetails.pincode,
                                studentDetails.country,
                            ]
                                .filter(Boolean)
                                .join(", ") || "N/A"}
                        </p>
                        <p>
                            <strong>Enrollment Date:</strong>{" "}
                            {studentDetails.enrollmentDate || "N/A"}
                        </p>
                        <p>
                            <strong>Grade:</strong> {studentDetails.grade || "N/A"}
                        </p>
                        <p>
                            <strong>Role:</strong> {studentDetails.role}
                        </p>
                        <p>
                            <strong>Class:</strong> {getClassName(studentDetails.classId)}
                        </p>
                        <p>
                            <strong>Subjects:</strong>{" "}
                            {getSubjectNames(studentDetails.subjectIds)}
                        </p>

                        {/* NEW: Parent Details */}
                        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                            Parent / Guardian Details
                        </h3>
                        <p>
                            <strong>Father's Name:</strong> {studentDetails.fatherName || "N/A"}
                        </p>
                        <p>
                            <strong>Mother's Name:</strong> {studentDetails.motherName || "N/A"}
                        </p>
                        <p>
                            <strong>Father's Phone:</strong>{" "}
                            {studentDetails.fatherMobileNumber || "N/A"}
                        </p>
                        <p>
                            <strong>Mother's Phone:</strong>{" "}
                            {studentDetails.motherMobileNumber || "N/A"}
                        </p>
                        <p>
                            <strong>Local Contact Phone:</strong>{" "}
                            {studentDetails.localMobileNumber || "N/A"}
                        </p>

                        {/* NEW: More Student Details */}
                        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                            Additional Student Information
                        </h3>
                        <p>
                            <strong>Religion:</strong> {studentDetails.religion || "N/A"}
                        </p>
                        <p>
                            <strong>Nationality:</strong> {studentDetails.nationality || "N/A"}
                        </p>
                        <p>
                            <strong>Category:</strong> {studentDetails.category || "N/A"}
                        </p>
                        <p>
                            <strong>Physical Handicapped:</strong>{" "}
                            {studentDetails.physicalHandicapped !== null
                                ? studentDetails.physicalHandicapped
                                    ? "Yes"
                                    : "No"
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