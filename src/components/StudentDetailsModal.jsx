import React from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentDetailsModal = ({ isOpen, onClose, studentData, onStudentUpdated }) => {
    if (!isOpen || !studentData) return null;

    const isGraduated = studentData.status === 'graduated';

    const handleSuspend = async () => {
        if (isGraduated) return;

        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-student-status/${studentData._id}`, {
                status: 'suspended',
            });

            if (response.status === 200) {
                toast.success('Student status updated to suspended');
                onStudentUpdated(response.data.student);
                onClose();
            } else {
                toast.error(response.data.message || 'Failed to update student status');
            }
        } catch (error) {
            // Handle error response from server
            const errorMessage = error.response?.data?.message ;
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-6 rounded-md w-[70vw] h-[70vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Student Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 overflow-y-auto flex-1">
                    <div><strong>Reg ID:</strong> {studentData._id || 'N/A'}</div>
                    <div><strong>Full Name:</strong> {studentData.fullName || 'N/A'}</div>
                    <div><strong>BECE ID No.:</strong> {studentData.BECEIndexNumber || 'N/A'}</div>
                    <div><strong>WASSCE ID No.:</strong> {studentData.WASSCEIndexNumber || 'None'}</div>
                    <div><strong>Gender:</strong> {studentData.gender || 'N/A'}</div>
                    <div><strong>Programme:</strong> {studentData.programme || 'N/A'}</div>
                    <div><strong>Begun From:</strong> {studentData.yearLevel || 'N/A'}</div>
                    <div><strong>Status:</strong> {studentData.status || 'N/A'}</div>
                    <div><strong>Library Status:</strong> {studentData.libraryStatus || 'N/A'}</div>
                    <div><strong>Bookshop Status:</strong> {studentData.bookshopStatus || 'N/A'}</div>
                    <div><strong>HOD Status:</strong> {studentData.HODApprovedStatus ? 'Approved' : 'Not Approved'}</div>
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                    <button 
                        onClick={handleSuspend} 
                        className={`p-2 rounded ${isGraduated || studentData.status =='suspended' ? 'bg-red-300 text-white cursor-not-allowed' : 'bg-red-400 text-white hover:bg-red-500'}`} 
                        disabled={isGraduated || studentData.status =='suspended'}
                        title={isGraduated && "Cannot suspend graduated student" || studentData.status =='suspended' ? "Already suspended!" : ""}
                    >
                        Suspend
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
