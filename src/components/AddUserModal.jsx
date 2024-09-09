import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa6';
import { departmentOptions, roleOptions } from '../../utils/constants'; // Ensure these are defined in your constants

const AddUserModal = ({ isOpen, onClose, onUserUpdated }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'role':
        setRole(value);
        break;
      case 'department':
        setDepartment(value);
        break;
      default:
        break;
    }
  };

  const validateEmail = (email) => {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    // Trim values before validation
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedRole = role.trim();
    const trimmedDepartment = department.trim();

    // Check if any required field is empty
    if (!trimmedFullName || !trimmedEmail || !trimmedRole) {
      return 'Full name, email, and role are required.';
    }

    // Check if email format is valid
    if (!validateEmail(trimmedEmail)) {
      return 'Invalid email format.';
    }

    // Check department if role is 'hod'
    if (trimmedRole === 'hod' && !trimmedDepartment) {
      return 'Department is required for HOD role.';
    }

    return '';
  };

  const handleAddUser = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/create-user`, { // Update endpoint
        fullName: fullName.trim(),
        email: email.trim(),
        role: role.trim(),
        department: role === 'hod' ? department.trim() : '', // Send department only if role is 'hod'
      });

      if (response.status === 201) {
        toast.success(response.data.message); // Display success message from the server
        onUserUpdated(); // Notify parent component if needed
        onClose();
      } else {
        toast.error(response.data.error || 'Failed to create user'); // Display error message from the server
      }
    } catch (error) {
      // Display a generic error message if no specific message is available
      toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-md w-full max-w-lg sm:w-full md:w-4/5 lg:w-1/2 h-auto max-h-screen overflow-y-auto">
        <h2 className="text-xl mb-4">Add New User</h2>

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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleInputChange}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select Role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {role === 'hod' && (
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={department}
                onChange={handleInputChange}
                className="border p-2 w-full mt-1"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleAddUser} className="bg-violet-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? <span className='flex items-center justify-center gap-x-2'><FaSpinner className='animate-spin'/>Adding...</span> : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
