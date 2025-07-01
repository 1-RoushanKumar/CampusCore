// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import StudentManagement from "../components/admin/StudentManagement";
import EducatorManagement from "../components/admin/EducatorManagement";
import ClassManagement from "../components/admin/ClassManagement";
import SubjectManagement from "../components/admin/SubjectManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab("students")}
                className={`w-full text-left py-2 px-4 rounded transition duration-200 ${
                  activeTab === "students" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                Manage Students
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab("educators")}
                className={`w-full text-left py-2 px-4 rounded transition duration-200 ${
                  activeTab === "educators"
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                Manage Educators
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab("subjects")}
                className={`w-full text-left py-2 px-4 rounded transition duration-200 ${
                  activeTab === "subjects" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                Manage Subjects
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab("classes")}
                className={`w-full text-left py-2 px-4 rounded transition duration-200 ${
                  activeTab === "classes" ? "bg-blue-600" : "hover:bg-gray-700"
                }`}
              >
                Manage Classes
              </button>
            </li>
            {/* Add more navigation items as needed */}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {activeTab === "students" && <StudentManagement />}
        {activeTab === "educators" && <EducatorManagement />}
        {activeTab === "subjects" && <SubjectManagement />}
        {activeTab === "classes" && <ClassManagement />}
        {/* Render other management components based on activeTab */}
      </div>
    </div>
  );
};

export default AdminDashboard;
