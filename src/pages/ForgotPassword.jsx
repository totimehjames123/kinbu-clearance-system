import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import FormTitle from '../components/FormTitle';
import FormTextField from '../components/FormTextField';
import FormButton from '../components/FormButton';
import ReactHotToast from '../components/ReactHotToast';
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate(); // Hook for navigation

    checkIsLoggedInAndNavigate("/login", null);

    const sendVerificationCodeToEmail = async () => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email.');
            return;
        }

        setIsLoading(true); // Set loading state to true while waiting for response

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/forgot-password`, { email });

            if (response.status === 200) {
                // Show success toast message
                toast.success(response.data.message, { duration: 5000 });
                
                // Navigate to reset-password after 5 seconds
                setTimeout(() => {
                    navigate('/reset-password');
                }, 5000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            // Handle specific error messages from the server
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An error occurred while processing your request.');
                console.error('Error:', error);
            }
        } finally {
            setIsLoading(false); // Set loading state back to false after request completes
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gray-50'>
            <ReactHotToast />
            <div className='w-full max-w-md p-5 lg:bg-white lg:p-6 lg:rounded-lg'>
                <div className='py-6 text-center'>
                    <Logo />
                </div>

                <FormTitle 
                    title={'Password Recovery'} 
                    description={'Provide your email address to receive a password reset link.'} 
                />
                <br />
                <FormTextField 
                    label={'Email'} 
                    type={'email'} 
                    placeholder={'Enter your email address'} 
                    id={'email'} 
                    value={email} 
                    setText={setEmail} 
                />
                <p className='text-orange-500 mt-3 text-xs'>
                    * We'll send you a verification link through the email you'll provide. <br /> 
                    &nbsp;&nbsp; Do not share your link with anyone!
                </p>
                <FormButton
                    title={isLoading ? <div className='flex items-center'><FaSpinner className='animate-spin mr-2'/> Please wait ...</div> : 'Proceed'}
                    handleSubmit={sendVerificationCodeToEmail}
                    isDisabled={isLoading}
                />
                <div className='text-center text-indigo-500 hover:underline'>
                    <Link to={'/login'}>Back to login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
