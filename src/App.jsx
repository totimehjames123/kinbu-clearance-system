import { useState } from 'react';
import './index.css';  // Ensure this file contains necessary styles
import './App.css';    // Ensure this file contains necessary styles
// import checkIsLoggedInAndNavigate from './utils/checkIsLoggedInAndNavigate';
import Logo from './components/Logo'; // Ensure this path is correct

function App() {
  // checkIsLoggedInAndNavigate("/all-events", null);

  return (
    <div className="relative h-screen">
      <img
        src="/images/image.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="absolute top-8 left-8">
          <Logo /> {/* Ensure your Logo component is styled appropriately */}
        </div>
        <div className="text-center text-white ">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'cursive' }}>
            Welcome <br />
            <span style={{ fontFamily: 'cursive' }} className='text-lg'>to</span>
          </h1>
          <h1 className="text-5xl font-bold mb-4">
            Kinbu Clearance System
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Streamline student clearance processes, reducing stress and paperwork, <br /> ensuring efficiency and smooth transitions for a better experience.            
          </p>
          <div className="flex justify-center items-center flex-nowrap gap-x-4">
            <a
              className="bg-violet-700 border-2 border-violet-700 hover:bg-violet-500 text-white font-bold py-4 px-8 rounded transition-all duration-300"
              href="./login"
            >
              Get Started
            </a>
            <a
              className="border-white border-2 hover:bg-black text-white font-bold py-4 px-8 rounded transition-all duration-300"
              href="mailto:support@kinbu.com?subject=Kinbu%20Clearance%20-%20Help%20%26%20Support&body=Hello,%20I%20need%20support%20with%20..."
            >
              Seek Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
