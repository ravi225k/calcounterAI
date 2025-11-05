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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect ensures that we only render on the client,
    // avoiding hydration mismatches with localStorage.
    setIsClient(true);
  }, []);

  const handleProfileCreated = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };
  
  if (!isClient) {
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

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  }

  if (!profile) {
    return <UserProfileSetup onProfileCreated={handleProfileCreated} />;
  }

  return (
    <AppDataProvider initialProfile={profile} onProfileUpdate={handleProfileUpdate}>
      <MainApp />
    </AppDataProvider>
  );
}
