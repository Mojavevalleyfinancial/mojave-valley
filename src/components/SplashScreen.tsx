"use client"
// SplashScreen.tsx

import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onLoadComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onLoadComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show "Loading" message and spinning circle for 3 seconds
    const loadingTimeout = setTimeout(() => {
      setShowWelcome(true);
    }, 3000);

    // Mark loading as complete after 3 seconds
    const loadCompleteTimeout = setTimeout(() => {
      onLoadComplete();
      setFadeOut(true);
    }, 6000);

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(loadCompleteTimeout);
    };
  }, [onLoadComplete]);

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-white ${fadeOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
      {showWelcome ? (
        <h1 className="text-4xl font-semibold text-center">Welcome</h1>
      ) : (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;

