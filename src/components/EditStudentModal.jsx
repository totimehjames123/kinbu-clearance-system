import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { departmentOptions, levelOptions } from './../../utils/constants'; // Import options

const EditStudentModal = ({ isOpen, onClose, studentData, onStudentUpdated }) => {
  const [fullName, setFullName] = useState(studentData?.fullName || '');
  const [BECEIndexNumber, setBECEIndexNumber] = useState(studentData?.BECEIndexNumber || '');
  const [WASSCEIndexNumber, setWASSCEIndexNumber] = useState(studentData?.WASSCEIndexNumber || '');
  const [gender, setGender] = useState(studentData?.gender || '');
  const [programme, setProgramme] = useState(studentData?.programme || '');
  const [yearLevel, setYearLevel] = useState(studentData?.yearLevel || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName(studentData?.fullName || '');
      setBECEIndexNumber(studentData?.BECEIndexNumber || '');
      setWASSCEIndexNumber(studentData?.WASSCEIndexNumber || '');
      setGender(studentData?.gender || '');
      setProgramme(studentData?.programme || '');
      setYearLevel(studentData?.yearLevel || '');
    }
  }, [isOpen, studentData]);

  const validateForm = () => {
    if (!fullName || !BECEIndexNumber || !gender || !programme || !yearLevel) {
      return 'All fields are required.';
    }
    return '';
  };

  const handleEditStudent = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-student/${studentData._id}`, {
        fullName,
        BECEIndexNumber,
        WASSCEIndexNumber,
        gender,
        programme,
        yearLevel,
      });

      if (response.status === 200) {
        toast.success('Student updated successfully');
        onStudentUpdated(response.data.student);
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update student');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-lg sm:w-full md:w-4/5 lg:w-1/2 h-auto max-h-screen overflow-y-auto">
        <h2 className="text-xl mb-4">Edit Student</h2>

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
              onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => setBECEIndexNumber(e.target.value)}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div>
            <label htmlFor="WASSCEIndexNumber" className="block text-sm font-medium text-gray-700">
              WASSCE Index Number
            </label>
            <input
              id="WASSCEIndexNumber"
              type="text"
              name="WASSCEIndexNumber"
              placeholder="WASSCE ID (if completed)"
              value={WASSCEIndexNumber}
              onChange={(e) => setWASSCEIndexNumber(e.target.value)}
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
              onChange={(e) => setGender(e.target.value)}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
              onChange={(e) => setProgramme(e.target.value)}
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
              onChange={(e) => setYearLevel(e.target.value)}
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
          <button onClick={handleEditStudent} className="bg-violet-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? <span className='flex items-center justify-center gap-x-2'><FaSpinner className='animate-spin' />Updating...</span> : 'Update Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
