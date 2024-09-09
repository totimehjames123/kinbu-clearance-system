import React from 'react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

// Importing the logo image
function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Logo />
      <br />
      <br />
      <div className="text-center">
        <h1 className="text-6xl text-gray-700 mb-2">404</h1>
        <h2 className="text-3xl text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-700">Sorry, the page you are looking for does not exist.</p>
        <br />
        <Link to={'all-events'} className='text-blue-500'>Go to Home Page</Link>
      </div>
    </div>
  );
}

export default PageNotFound;
