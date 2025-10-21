'use client';

import { Button } from '~/common/components/ui/Button';

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
        <h1 className="text-3xl font-bold mb-4 text-navy-700">
          You can now close this window.
        </h1>
        
        {/* Instructional Text */}
        <p className="mb-8 leading-relaxed text-sm text-navy-700">
          If you want to open your analytics page again, please go back to app.expeerly.com and in the top right menu click &quot;Analytics&quot;
        </p>
        
        {/* Call to Action Button */}
        <Button
          onClick={handleGoToApp}
          variant="primary"
          size="lg"
          className="px-8"
        >
          Go to expeerly app
        </Button>
      </div>
    </div>
  );
}
