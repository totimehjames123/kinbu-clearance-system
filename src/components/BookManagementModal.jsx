import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa6';
import { getUserRole } from '../../utils/getUserRole';
import { useNavigate } from 'react-router-dom';

const BookManagementModal = ({ isOpen, onClose, studentData, onStudentUpdated }) => {
    if (!isOpen || !studentData) return null;

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        studentId: studentData._id,
        studentClass: '',
        bookName: '',
        bookNumber: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const trimmedStudentClass = formData.studentClass.trim();
        const trimmedBookName = formData.bookName.trim();
        const trimmedBookNumber = formData.bookNumber.trim();

        if (!trimmedStudentClass || !trimmedBookName || !trimmedBookNumber) {
            return 'Student class, book name, and book number are required.';
        }

        return '';
    };

    const handleAddTransaction = async () => {
        const validationMessage = validateForm();
        if (validationMessage) {
            toast.error(validationMessage);
            return;
        }

        setIsLoading(true);

        const origin = getUserRole() === 'librarian' ? 'library' : 'bookshop';

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-transaction`, {
                studentId: formData.studentId,
                studentClass: formData.studentClass,
                bookName: formData.bookName,
                bookNumber: formData.bookNumber,
                origin
            });

            if (response.status === 201) {
                toast.success('Book transaction recorded successfully');
                onStudentUpdated(response.data.transaction);
                onClose();
                navigate("/book-transactions")
                
            } else {
                toast.error(response.data.error || 'Failed to record book transaction');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-6 rounded-md w-full max-w-lg sm:w-full md:w-4/5 lg:w-1/2 h-auto max-h-screen overflow-y-auto">
                <h2 className="text-xl mb-4">Book Offer Management</h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">
                            Student Name
                        </label>
                        <input
                            id="studentClass"
                            type="text"
                            placeholder="Student Name"
                            value={studentData.fullName}
                            className="border p-2 w-full mt-1"
                            disabled
                        />
                    </div>

                    <div>
                        <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700">
                            Student Class
                        </label>
                        <input
                            id="studentClass"
                            type="text"
                            name="studentClass"
                            placeholder="Student Class"
                            value={formData.studentClass}
                            onChange={handleInputChange}
                            className="border p-2 w-full mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">
                            Book Name
                        </label>
                        <input
                            id="bookName"
                            type="text"
                            name="bookName"
                            placeholder="Book Name"
                            value={formData.bookName}
                            onChange={handleInputChange}
                            className="border p-2 w-full mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="bookNumber" className="block text-sm font-medium text-gray-700">
                            Book Number
                        </label>
                        <input
                            id="bookNumber"
                            type="text"
                            name="bookNumber"
                            placeholder="Book Number"
                            value={formData.bookNumber}
                            onChange={handleInputChange}
                            className="border p-2 w-full mt-1"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={handleAddTransaction} className="bg-violet-500 text-white p-2 rounded" disabled={isLoading}>
                        {isLoading ? (
                            <span className='flex items-center justify-center gap-x-2'>
                                <FaSpinner className='animate-spin' />
                                Processing...
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookManagementModal;
