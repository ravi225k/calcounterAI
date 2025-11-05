"use client";

import { useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import HomeTab from '@/components/HomeTab';
import DailyLogsTab from '@/components/DailyLogsTab';
import ProfileTab from '@/components/ProfileTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, LayoutDashboard, ScrollText, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MainApp() {
  const { profile } = useAppData();
  
  if (!profile) {
    return null; // or a loading spinner
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Utensils className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">CalCounter AI</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="font-medium">{profile.name}</span>
            <Avatar>
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="home" className="gap-2"><LayoutDashboard/>Home</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><ScrollText/>Daily Logs</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User/>Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <HomeTab />
          </TabsContent>
          <TabsContent value="logs">
            <DailyLogsTab />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        &copy; 2024 CalCounter AI.
      </footer>
    </div>
  );
}
