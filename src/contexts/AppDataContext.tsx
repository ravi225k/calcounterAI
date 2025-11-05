"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { UserProfile, Logs, LogEntry } from '@/lib/types';
import { format } from 'date-fns';

interface AppDataContextType {
  profile: UserProfile | null;
  logs: Logs;
  setProfile: (profile: UserProfile | null) => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'date'>) => void;
  updateLog: (updatedEntry: LogEntry) => void;
  deleteLog: (logId: string, date: string) => void;
  updateProfile: (updatedProfile: UserProfile) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children, initialProfile, onProfileUpdate }: { children: ReactNode; initialProfile: UserProfile, onProfileUpdate: (profile: UserProfile) => void; }) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('user-profile', initialProfile);
  const [logs, setLogs] = useLocalStorage<Logs>('daily-logs', {});

  const addLog = (entry: Omit<LogEntry, 'id' | 'date'>) => {
    const dateKey = format(new Date(), 'yyyy-MM-dd');
    const newLog: LogEntry = {
      ...entry,
      id: new Date().toISOString(),
      date: dateKey,
    };
    
    setLogs(prevLogs => {
      const logsForDate = prevLogs[dateKey] ? [...prevLogs[dateKey], newLog] : [newLog];
      return { ...prevLogs, [dateKey]: logsForDate };
    });
  };

  const updateLog = (updatedEntry: LogEntry) => {
    setLogs(prevLogs => {
      const logsForDate = prevLogs[updatedEntry.date];
      if (!logsForDate) return prevLogs;

      const updatedLogsForDate = logsForDate.map(log => 
        log.id === updatedEntry.id ? updatedEntry : log
      );
      
      return { ...prevLogs, [updatedEntry.date]: updatedLogsForDate };
    });
  };

  const deleteLog = (logId: string, date: string) => {
     setLogs(prevLogs => {
      const logsForDate = prevLogs[date];
      if (!logsForDate) return prevLogs;

      const filteredLogs = logsForDate.filter(log => log.id !== logId);
      
      return { ...prevLogs, [date]: filteredLogs };
    });
  };

  const updateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    onProfileUpdate(updatedProfile);
  }


  return (
    <AppDataContext.Provider value={{ profile, setProfile, logs, addLog, updateLog, deleteLog, updateProfile }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
