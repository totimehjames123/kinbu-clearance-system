import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import FormTitle from '../components/FormTitle';
import FormButton from '../components/FormButton';
import Logo from '../components/Logo';
import FormTextField from '../components/FormTextField';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactHotToast from '../components/ReactHotToast';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

function UpdatePassword() {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShownCurrentPassword, setIsShownCurrentPassword] = useState(false);
  const [isShownNewPassword, setIsShownNewPassword] = useState(false);

  const navigate = useNavigate()
  checkIsLoggedInAndNavigate(null, "/login");


  useEffect(() => {
    // Retrieve currentUser from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    setUsername(currentUser?.username || ''); // Set the username state
  }, []);

  const toggleShowCurrentPassword = () => {
    setIsShownCurrentPassword(!isShownCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setIsShownNewPassword(!isShownNewPassword);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Adjust validation as per your requirements
  };

  const handlePasswordChange = async () => {
    if (!validatePassword(currentPassword) || !validatePassword(newPassword)) {
      toast.error('Both passwords must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/change-password`, {
        username,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success('Password changed successfully!');
        // Optionally, navigate to a different page or clear the form
        localStorage.clear()
        navigate('/login')
      } else {
        toast.error(response.data.error || 'Password change failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center bg-gray-50 justify-center h-screen p-5'>
      <div className='w-full max-w-md lg:bg-white lg:p-6 lg:rounded-lg'>
        <ReactHotToast />
        <div className='py-6 text-center'>
          <Logo />
        </div>
        <FormTitle
          title={'Update Password'}
          description={'Please enter your current password and new password to update your password.'}
        />
        <br />
        <FormTextField
          label={'Username'}
          type={'text'}
          placeholder={'Enter your Username'}
          id={'username'}
          value={username}
          required={true}
          setText={setUsername}
          disabled // Make it disabled as it's pre-filled and uneditable
        />
        <FormTextField
          label={'Current Password'}
          type={isShownCurrentPassword ? 'text' : 'password'}
          placeholder={'Enter your current password'}
          id={'currentPassword'}
          toggleShowPassword={toggleShowCurrentPassword}
          toggleShowPasswordText={isShownCurrentPassword ? 'HIDE' : 'SHOW'}
          value={currentPassword}
          required={true}
          setText={setCurrentPassword}
        />
        <FormTextField
          label={'New Password'}
          type={isShownNewPassword ? 'text' : 'password'}
          placeholder={'Enter your new password'}
          id={'newPassword'}
          toggleShowPassword={toggleShowNewPassword}
          toggleShowPasswordText={isShownNewPassword ? 'HIDE' : 'SHOW'}
          value={newPassword}
          required={true}
          setText={setNewPassword}
        />
        <FormButton
          title={isLoading ? <div className='flex items-center'><FaSpinner className='animate-spin mr-2'/> Please wait ...</div> : 'Update Password'}
          isDisabled={isLoading}
          handleSubmit={() => handlePasswordChange()}
        />
        <div className='text-center'>
          <Link to={'/login'} className='text-violet-500'>Go back</Link>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
