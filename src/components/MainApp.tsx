"use client";

import { useAppData } from '@/contexts/AppDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HomeTab from '@/components/HomeTab';
import DailyLogsTab from '@/components/DailyLogsTab';

export default function MainApp() {
  const { profile } = useAppData();

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">CalCounter AI</h1>
          <p className="text-xl text-muted-foreground">Hi, {profile.name}</p>
        </header>
        
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="logs">My Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <HomeTab />
          </TabsContent>
          <TabsContent value="logs">
            <DailyLogsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
