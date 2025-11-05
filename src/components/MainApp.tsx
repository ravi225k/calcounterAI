"use client";

import { useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import HomeTab from '@/components/HomeTab';
import DailyLogsTab from '@/components/DailyLogsTab';
import ProfileTab from '@/components/ProfileTab';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Utensils, LayoutDashboard, ScrollText, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

type NavItem = 'home' | 'logs' | 'profile';

export default function MainApp() {
  const { profile } = useAppData();
  const [activeTab, setActiveTab] = useState<NavItem>('home');

  if (!profile) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'logs':
        return <DailyLogsTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Utensils className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">CalCounter AI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveTab('home')} isActive={activeTab === 'home'}><LayoutDashboard/>Home</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveTab('logs')} isActive={activeTab === 'logs'}><ScrollText/>My Logs</SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveTab('profile')} isActive={activeTab === 'profile'}><User/>My Profile</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
          <p className="text-xs text-muted-foreground text-center">&copy; 2024 CalCounter AI</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground">
           <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:px-8">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline capitalize">{activeTab}</h1>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile.fitnessGoal.replace('-', ' ')}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="container mx-auto p-4 sm:p-6 md:p-8">
            {renderContent()}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
