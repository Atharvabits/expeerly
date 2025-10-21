'use client';

import { useState } from 'react';

export default function LogoutPage() {
  const handleGoToApp = () => {
    // Navigate to the main expeerly app
    window.location.href = 'https://app.expeerly.com';
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      {/* Main Content Area */}
      <div className="bg-gray-200 rounded-lg p-8 max-w-md w-full text-center">
        {/* Main Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          You can now close this window.
        </h1>
        
        {/* Instructional Text */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          If you want to open your analytics page again, please go back to app.expeerly.com and in the top right menu click "Analytics"
        </p>
        
        {/* Call to Action Button */}
        <button
          onClick={handleGoToApp}
          className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors"
        >
          Go to expeerly app
        </button>
      </div>
    </div>
  );
}
