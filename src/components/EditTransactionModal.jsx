import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const EditTransactionModal = ({ isOpen, onClose, transactionData, onTransactionUpdated }) => {
  const [bookName, setBookName] = useState(transactionData?.bookName || '');
  const [bookNumber, setBookNumber] = useState(transactionData?.bookNumber || '');
  const [origin, setOrigin] = useState(transactionData?.origin || '');
  const [studentClass, setStudentClass] = useState(transactionData?.studentClass || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBookName(transactionData?.bookName || '');
      setBookNumber(transactionData?.bookNumber || '');
      setOrigin(transactionData?.origin || '');
      setStudentClass(transactionData?.studentClass || '');
    }
  }, [isOpen, transactionData]);

  const validateForm = () => {
    if (!bookName || !bookNumber || !origin || !studentClass) {
      return 'All fields are required.';
    }
    return '';
  };

  const handleEditTransaction = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-transaction/${transactionData._id}`, {
        bookName,
        bookNumber,
        origin,
        studentClass,
      });

      if (response.status === 200) {
        toast.success('Transaction updated successfully');
        onTransactionUpdated();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update transaction');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-lg sm:w-full md:w-4/5 lg:w-1/2 h-auto max-h-screen overflow-y-auto">
        <h2 className="text-xl mb-4">Edit Transaction</h2>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">
              Book Name
            </label>
            <input
              id="bookName"
              type="text"
              name="bookName"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
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
              value={bookNumber}
              onChange={(e) => setBookNumber(e.target.value)}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
              Origin
            </label>
            <input
              id="origin"
              type="text"
              name="origin"
              placeholder="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
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
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="border p-2 w-full mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleEditTransaction} className="bg-violet-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? <span className='flex items-center justify-center gap-x-2'><FaSpinner className='animate-spin' />Updating...</span> : 'Update Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
