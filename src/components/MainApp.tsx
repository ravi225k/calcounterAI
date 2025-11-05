"use client";

import { useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import HomeTab from '@/components/HomeTab';
import DailyLogsTab from '@/components/DailyLogsTab';
import ProfileTab from '@/components/ProfileTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ScrollText } from 'lucide-react';

export default function MainApp() {
  const { profile } = useAppData();
  const [activeTab, setActiveTab] = useState('home');
  
  if (!profile) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6 md:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">CalCounter AI</h1>
          <button onClick={() => setActiveTab('profile')} className="text-sm text-muted-foreground hover:text-primary">
            Hi, {profile.name}!
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="home" className="gap-2"><LayoutDashboard/>Home</TabsTrigger>
            <TabsTrigger value="logs" className="gap-2"><ScrollText/>Daily Logs</TabsTrigger>
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
