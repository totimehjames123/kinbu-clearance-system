import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { departmentOptions, levelOptions } from './../../utils/constants'; 
import { FaSpinner } from 'react-icons/fa6';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [fullName, setFullName] = useState('');
  const [BECEIndexNumber, setBECEIndexNumber] = useState('');
  const [gender, setGender] = useState('');
  const [programme, setProgramme] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'BECEIndexNumber':
        setBECEIndexNumber(value);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'programme':
        setProgramme(value);
        break;
      case 'yearLevel':
        setYearLevel(value);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    // Trim values before validation
    const trimmedFullName = fullName.trim();
    const trimmedBECEIndexNumber = BECEIndexNumber.trim();
    const trimmedGender = gender.trim();
    const trimmedProgramme = programme.trim();
    const trimmedYearLevel = yearLevel.trim();

    console.log('Validating:', {
      fullName: trimmedFullName,
      BECEIndexNumber: trimmedBECEIndexNumber,
      gender: trimmedGender,
      programme: trimmedProgramme,
      yearLevel: trimmedYearLevel
    });

    // Check if any field is empty
    if (!trimmedFullName || !trimmedBECEIndexNumber || !trimmedGender || !trimmedProgramme) {
      return 'Full name, BECE index number, gender, and programme are required.';
    }

    return '';
  };

  const handleAddStudent = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/add-student`, {
        fullName,
        BECEIndexNumber,
        gender,
        programme,
        yearLevel: yearLevel || 'Form 1', // Default to 'Form 1' if not provided
      });

      if (response.status === 201) {
        toast.success(response.data.message); // Display success message from the server
        onStudentAdded(response.data.student); // Use the correct field name from the server response
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add student'); // Display error message from the server
      }
    } catch (error) {
      // Display a generic error message if no specific message is available
      toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-lg sm:w-full md:w-4/5 lg:w-1/2 h-auto max-h-screen overflow-y-auto">
        <h2 className="text-xl mb-4">Add New Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div>
            <label htmlFor="BECEIndexNumber" className="block text-sm font-medium text-gray-700">
              BECE Index Number
            </label>
            <input
              id="BECEIndexNumber"
              type="text"
              name="BECEIndexNumber"
              placeholder="BECE Index Number"
              value={BECEIndexNumber}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="programme" className="block text-sm font-medium text-gray-700">
              Programme
            </label>
            <select
              id="programme"
              name="programme"
              value={programme}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select Programme</option>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700">
              Year Level
            </label>
            <select
              id="yearLevel"
              name="yearLevel"
              value={yearLevel}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select Year Level</option>
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleAddStudent} className="bg-violet-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? <span className='flex items-center justify-center gap-x-2'><FaSpinner className='animate-spin'/>Adding...</span> : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
