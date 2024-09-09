import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import FormTitle from '../components/FormTitle';
import FormTextField from '../components/FormTextField';
import FormButton from '../components/FormButton';
import ReactHotToast from '../components/ReactHotToast';
import { FaSpinner } from 'react-icons/fa';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

const ResetPassword = () => {
    const [email, setEmail] = useState(''); // Email state
    const [verificationCode, setVerificationCode] = useState(''); // Verification code state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // Hook for navigation

    checkIsLoggedInAndNavigate("/login", null);

    const handleResetPassword = async () => {
        if (email.trim() === "") {
            toast.error('Email field cannot be left blank!');
            return;
        }

        if (verificationCode.trim() === "") {
            toast.error('Verification code field cannot be left blank!');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true); // Set loading state to true while waiting for response

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/reset-password`, {
                email,
                verificationCode, // Correct field name
                newPassword
            });

            if (response.status === 200) {
                toast.success(response.data.message, { duration: 5000 });
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to reset password');
            }
        } finally {
            setIsLoading(false); // Set loading state back to false after request completes
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <ReactHotToast /> 
            <div className='w-full max-w-md p-5 bg-white shadow-md rounded-lg'>
                <div className='py-6 text-center'>
                    <Logo /> 
                </div>

                <FormTitle title={'Reset Password'} description={'Enter your new password and verification code to reset your account password.'} />
                <br />
                <FormTextField 
                    label={'Email'} 
                    type={'email'} 
                    placeholder={'Enter your email address'} 
                    id={'email'} 
                    value={email} 
                    setText={setEmail} 
                />
                <br />
                <FormTextField 
                    label={'Verification Code'} 
                    type={'text'} 
                    placeholder={'Enter the verification code'} 
                    id={'verificationCode'} 
                    value={verificationCode} 
                    setText={setVerificationCode} 
                />
                <br />
                <FormTextField 
                    label={'New Password'} 
                    type={'password'} 
                    placeholder={'Enter your new password'} 
                    id={'newPassword'} 
                    value={newPassword} 
                    setText={setNewPassword} 
                />
                <br />
                <FormTextField 
                    label={'Confirm Password'} 
                    type={'password'} 
                    placeholder={'Confirm your new password'} 
                    id={'confirmPassword'} 
                    value={confirmPassword} 
                    setText={setConfirmPassword} 
                />
                <p className='text-orange-500 mt-3 text-xs'>
                    * Passwords must match and contain at least 6 characters.
                </p>
                <FormButton
                    title={isLoading ? <div className='flex items-center'><FaSpinner className='animate-spin mr-2'/> Please wait ...</div> : 'Reset Password'}
                    handleSubmit={handleResetPassword}
                    isDisabled={isLoading}
                />
                <div className='text-center text-indigo-500 hover:underline'>
                    <Link to={'/login'}>Back to login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
