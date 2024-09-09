import React, { useState } from 'react';
import FormTitle from '../components/FormTitle';
import FormButton from '../components/FormButton';
import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import FormTextField from '../components/FormTextField';
import ReactHotToast from '../components/ReactHotToast';
import toast from 'react-hot-toast';
import getUserRole from '../../utils/getUserRole';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';


function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShownPassword, setIsShownPassword] = useState(false);

  if (getUserRole() == "admin"){
      checkIsLoggedInAndNavigate("/dashboard", null);
  }
  else if (getUserRole() == "hod"){
    checkIsLoggedInAndNavigate("/manage-students", null);
  }
  else if (getUserRole() == "bookshop" || getUserRole() === "librarian"){
    checkIsLoggedInAndNavigate("/book-management", null);
  }

  const toggleShowPassword = () => {
    setIsShownPassword(!isShownPassword);
  };


  const validatePassword = (password) => {
    return password.length >= 1; // Adjust validation as per your requirements
  };

  const handleLogin = async () => {
    if (!validatePassword(password)) {
      toast.error('Password cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        toast.success(response.data.message || 'Login successful!');
        if (response.data.user.role == "admin"){
          navigate('/dashboard');
        }
        else if (response.data.user.role == "hod"){
          navigate('/manage-students')
        }
        else if (response.data.user.role == "bookshop" || response.data.user.role === "librarian"){
          navigate('/book-management')
        }
      } else {
        toast.error(response.data.error || 'Login failed. Please check your credentials.');
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
          title={'Welcome Back!'}
          description={'Kindly provide your login information to proceed (i.e. Username & password).'}
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
        />
        <br />
        <FormTextField
          label={'Password'}
          type={isShownPassword ? 'text' : 'password'}
          placeholder={'Enter your password'}
          id={'password'}
          toggleShowPassword={toggleShowPassword}
          toggleShowPasswordText={isShownPassword ? 'HIDE' : 'SHOW'}
          value={password}
          required={true}
          setText={setPassword}
        />
        <FormButton
          title={isLoading ? <div className='flex items-center'><FaSpinner className='animate-spin mr-2'/> Please wait ...</div> : 'Login'}
          isDisabled={isLoading}
          handleSubmit={() => handleLogin()}
        />
        <div className='text-center'>
          <Link to={'/forgot-password'} className='text-violet-500'>Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
