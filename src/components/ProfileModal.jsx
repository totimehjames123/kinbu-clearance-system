import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProfileModal({ closeModal }) {
  const navigate = useNavigate();
  
  const logout = () => {
            
    if (confirm("Are you sure you want to logout? Click OK to confirm.")){
        navigate('/login')
        localStorage.removeItem('currentUser')
    }
    else{
        alert('Login attempt cancelled!')
    }

    
  }

  // Get the current user data from localStorage
  const { studentId, name, level, department, email, role, phoneNumber } = JSON?.parse(localStorage?.getItem('currentUser'));

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-60">
      <div className="relative w-[90%] lg:w-full max-w-md p-4 mx-auto my-6 transition-all transform bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-gray-500 cursor-pointer focus:outline-none"
            onClick={() => closeModal()}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <img
            src="/images/user.png"
            className="mx-auto rounded-full w-24 h-24"
            alt="user"
          />
          <h3 className="text-xl font-bold mt-4">{name}</h3>
          <p className="text-gray-600 text-xs mb-3">@{studentId}</p>
          <p className="text-gray-600 text-sm mb-5 px-8"> 
            {role} · {level} · {department} · {email} · {phoneNumber}
          </p>

          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate("/update-password")} className={`bg-black hover:bg-gray-800 text-xs text-white p-2 rounded-lg focus:outline-none focus:ring-opacity-50`}>
              Edit Password
            </button>
            <button onClick={logout}  className="border border-violet-900 hover:border-violet-900 text-violet-800 px-2 py-1 rounded-md shadow-violet-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
