// src/components/admin/ClassManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Your Axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import Modal from '../common/Modal'; // Reusing the Modal component

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(null); // Null for create, object for edit
  const [formData, setFormData] = useState({
    className: '',
    classCode: '',
    description: '',
  });

  // State for View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState(null);

  // --- Fetch Classes ---
  const fetchClasses = async (currentPage = page) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/classes`, {
        params: { page: currentPage, size },
      });
      setClasses(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, size]); // Refetch when page or size changes

  // --- Handle Form Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Open Modals ---
  const handleAddClass = () => {
    setCurrentClass(null); // Clear for new class
    setFormData({ // Reset form data
      className: '',
      classCode: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClass = (clazz) => {
    setCurrentClass(clazz);
    setFormData({
      className: clazz.className,
      classCode: clazz.classCode,
      description: clazz.description || '',
    });
    setIsModalOpen(true);
  };

  const handleViewClass = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/admin/classes/${id}`);
      setClassDetails(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError('Failed to fetch class details.');
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Create/Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isCreating = currentClass === null;

    try {
      if (isCreating) {
        await api.post('/admin/classes', formData); // ClassDto is JSON, no multipart
        console.log('Class created successfully');
      } else {
        await api.put(`/admin/classes/${currentClass.id}`, formData); // ClassDto is JSON, no multipart
        console.log('Class updated successfully');
      }
      setIsModalOpen(false);
      fetchClasses(); // Refresh list
    } catch (err) {
      console.error('Error saving class:', err.response?.data || err.message);
      setError('Failed to save class: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Class ---
  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setLoading(true);
      setError('');
      try {
        await api.delete(`/admin/classes/${id}`);
        console.log('Class deleted successfully');
        fetchClasses(); // Refresh list
      } catch (err) {
        console.error('Error deleting class:', err);
        setError('Failed to delete class.');
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

  if (loading && classes.length === 0) {
    return <div className="text-center py-8">Loading classes...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Classes</h2>
        <button
          onClick={handleAddClass}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Class
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {classes.length === 0 && !loading ? (
        <p className="text-center text-gray-600">No classes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Class Name</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Class Code</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((clazz) => (
                <tr key={clazz.id}>
                  <td className="py-4 px-6 whitespace-nowrap">{clazz.className}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{clazz.classCode}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{clazz.description || 'N/A'}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewClass(clazz.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleEditClass(clazz)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(clazz.id)}
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

      {/* Create/Edit Class Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentClass ? 'Edit Class' : 'Add New Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
            <input type="text" id="className" name="className" value={formData.className} onChange={handleChange} required
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="classCode" className="block text-sm font-medium text-gray-700">Class Code</label>
            <input type="text" id="classCode" name="classCode" value={formData.classCode} onChange={handleChange} required
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Class Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Class Details">
        {classDetails ? (
          <div className="space-y-4 text-gray-700">
            <p><strong>ID:</strong> {classDetails.id}</p>
            <p><strong>Class Name:</strong> {classDetails.className}</p>
            <p><strong>Class Code:</strong> {classDetails.classCode}</p>
            <p><strong>Description:</strong> {classDetails.description || 'N/A'}</p>
            <h4 className="font-semibold mt-4">Educators:</h4>
            {classDetails.educators && classDetails.educators.length > 0 ? (
              <ul className="list-disc list-inside">
                {classDetails.educators.map((educator) => (
                  <li key={educator.id}>{educator.firstName} {educator.lastName} ({educator.email})</li>
                ))}
              </ul>
            ) : (
              <p>No educators assigned.</p>
            )}
            <h4 className="font-semibold mt-4">Students:</h4>
            {classDetails.students && classDetails.students.length > 0 ? (
              <ul className="list-disc list-inside">
                {classDetails.students.map((student) => (
                  <li key={student.id}>{student.firstName} {student.lastName} ({student.email})</li>
                ))}
              </ul>
            ) : (
              <p>No students assigned.</p>
            )}
          </div>
        ) : (
          <p>Loading class details...</p>
        )}
      </Modal>
    </div>
  );
};

export default ClassManagement;