'use client';


export default function LogoutPage() {
  const handleGoToApp = () => {
    // Navigate to the main expeerly app
    window.location.href = 'https://app.expeerly.com';
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      {/* Main Content Area */}
      <div className="text-center max-w-md">
        {/* Main Message */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#080218' }}>
          You can now close this window.
        </h1>
        
        {/* Instructional Text */}
        <p className="mb-8 leading-relaxed text-sm" style={{ color: '#080218' }}>
          If you want to open your analytics page again, please go back to app.expeerly.com and in the top right menu click &quot;Analytics&quot;
        </p>
        
        {/* Call to Action Button */}
        <button
          onClick={handleGoToApp}
          className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-full font-semibold transition-colors"
        >
          Go to expeerly app
        </button>
      </div>
    </div>
  );
}
