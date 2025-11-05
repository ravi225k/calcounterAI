"use client";

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AppDataProvider } from '@/contexts/AppDataContext';
import UserProfileSetup from '@/components/UserProfileSetup';
import MainApp from '@/components/MainApp';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('user-profile', null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect ensures that we only check localStorage on the client
    // and avoid hydration mismatches.
    const storedProfile = localStorage.getItem('user-profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
  }, [setProfile]);

  const handleProfileCreated = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-8">
        <div className="w-full max-w-2xl space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <UserProfileSetup onProfileCreated={handleProfileCreated} />;
  }

  return (
    <AppDataProvider initialProfile={profile}>
      <MainApp />
    </AppDataProvider>
  );
}
