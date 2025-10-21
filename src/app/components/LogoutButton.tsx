'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '~/common/components/ui/Button';

export const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Clear auth data
      localStorage.removeItem('auth_token');
      sessionStorage.clear();

      // Redirect to login page
      router.replace('/logout');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="w-max px-6 py-2"
      variant="primary"
      disabled={isLoading}
      loading={isLoading}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
};



