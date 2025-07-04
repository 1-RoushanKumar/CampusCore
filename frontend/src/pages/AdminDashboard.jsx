import React, {useState, useEffect} from "react";
import StudentManagement from "../components/admin/StudentManagement";
import EducatorManagement from "../components/admin/EducatorManagement";
import ClassManagement from "../components/admin/ClassManagement";
import SubjectManagement from "../components/admin/SubjectManagement";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faChalkboardTeacher,
    faBook,
    faBuilding,
    faChartLine,
    faNewspaper // Ensure this is imported
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import NewsManagement from "../components/admin/NewsManagment.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalEducators: 0,
        totalSubjects: 0,
        totalClasses: 0,
        totalPublishedNews: 0, // <--- ADD THIS LINE
    });
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [overviewError, setOverviewError] = useState('');

    // --- Fetch Dashboard Overview Data ---
    useEffect(() => {
        const fetchOverviewData = async () => {
            setLoadingOverview(true);
            setOverviewError('');
            try {
                const [
                    studentsCountResponse,
                    educatorsCountResponse,
                    subjectsCountResponse,
                    classesCountResponse,
                    publishedNewsCountResponse, // <--- ADD THIS LINE
                ] = await Promise.all([
                    api.get("/admin/students/count"), // Updated endpoint based on AdminStatsController
                    api.get("/admin/educators/count"), // Updated endpoint
                    api.get("/admin/subjects/count"), // Updated endpoint
                    api.get("/admin/classes/count"), // Updated endpoint
                    api.get("/admin/news/published/count"), // <--- NEW ENDPOINT FOR NEWS COUNT
                ]);

                setDashboardData({
                    totalStudents: studentsCountResponse.data,
                    totalEducators: educatorsCountResponse.data,
                    totalSubjects: subjectsCountResponse.data,
                    totalClasses: classesCountResponse.data,
                    totalPublishedNews: publishedNewsCountResponse.data, // <--- SET NEWS COUNT
                });
            } catch (err) {
                console.error("Error fetching dashboard overview data:", err);
                setOverviewError("Failed to load overview data. Please check backend endpoints.");
                setDashboardData({
                    totalStudents: 'N/A',
                    totalEducators: 'N/A',
                    totalSubjects: 'N/A',
                    totalClasses: 'N/A',
                    totalPublishedNews: 'N/A', // <--- SET TO N/A ON ERROR
                });
            } finally {
                setLoadingOverview(false);
            }
        };

        if (activeTab === "overview") {
            fetchOverviewData();
        }
    }, [activeTab]);

    // Dashboard Overview component that displays dynamic data
    const DashboardOverview = () => (
        <div>
            {loadingOverview ? (
                <div className="text-center py-8 text-blue-600 text-xl">Loading overview data...</div>
            ) : overviewError ? (
                <div className="text-center py-8 text-red-600 text-xl font-semibold">Error: {overviewError}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        className="bg-white p-6 rounded-lg shadow-md border border-blue-200 flex items-center space-x-4">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-4xl"/>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Total Students</h3>
                            <p className="text-3xl font-bold text-blue-700">{dashboardData.totalStudents}</p>
                        </div>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-md border border-green-200 flex items-center space-x-4">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600 text-4xl"/>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Total Educators</h3>
                            <p className="text-3xl font-bold text-green-700">{dashboardData.totalEducators}</p>
                        </div>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-md border border-purple-200 flex items-center space-x-4">
                        <FontAwesomeIcon icon={faBook} className="text-purple-600 text-4xl"/>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Total Subjects</h3>
                            <p className="text-3xl font-bold text-purple-700">{dashboardData.totalSubjects}</p>
                        </div>
                    </div>
                    <div
                        className="bg-white p-6 rounded-lg shadow-md border border-yellow-200 flex items-center space-x-4">
                        <FontAwesomeIcon icon={faBuilding} className="text-yellow-600 text-4xl"/>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Total Classes</h3>
                            <p className="text-3xl font-bold text-yellow-700">{dashboardData.totalClasses}</p>
                        </div>
                    </div>
                    {/* NEW CARD FOR PUBLISHED NEWS */}
                    <div
                        className="bg-white p-6 rounded-lg shadow-md border border-pink-200 flex items-center space-x-4">
                        <FontAwesomeIcon icon={faNewspaper} className="text-pink-600 text-4xl"/>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">Published News</h3>
                            <p className="text-3xl font-bold text-pink-700">{dashboardData.totalPublishedNews}</p>
                        </div>
                    </div>
                    {/* Add more overview cards/charts as needed */}
                </div>
            )}
        </div>
    );


    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-gray-100">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-gray-800 text-white p-4 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">Admin Panel</h2>
                <nav>
                    <ul>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "overview" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faChartLine} className="mr-3"/> Overview
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("students")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "students" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faUsers} className="mr-3"/> Manage Students
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("educators")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "educators" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-3"/> Manage Educators
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("subjects")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "subjects" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faBook} className="mr-3"/> Manage Subjects
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("classes")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "classes" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faBuilding} className="mr-3"/> Manage Classes
                            </button>
                        </li>
                        <li className="mb-2">
                            <button
                                onClick={() => setActiveTab("news")}
                                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 flex items-center ${
                                    activeTab === "news" ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                                }`}
                            >
                                <FontAwesomeIcon icon={faNewspaper} className="mr-3"/> Manage News
                            </button>
                        </li>
                        {/* Add more navigation items as needed */}
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-gray-50">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    {activeTab === "overview" && "Dashboard Overview"}
                    {activeTab === "students" && "Student Management"}
                    {activeTab === "educators" && "Educator Management"}
                    {activeTab === "subjects" && "Subject Management"}
                    {activeTab === "classes" && "Class Management"}
                    {activeTab === "news" && "News Management"}
                </h1>

                {activeTab === "overview" && <DashboardOverview/>}
                {activeTab === "students" && <StudentManagement/>}
                {activeTab === "educators" && <EducatorManagement/>}
                {activeTab === "subjects" && <SubjectManagement/>}
                {activeTab === "classes" && <ClassManagement/>}
                {activeTab === "news" && <NewsManagement/>}
            </div>
        </div>
    );
};

export default AdminDashboard;