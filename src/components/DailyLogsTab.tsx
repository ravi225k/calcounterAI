"use client";

import { useState, useMemo } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { format, parseISO } from 'date-fns';
import type { LogEntry } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Save, XCircle, CalendarDays } from 'lucide-react';

const LogList = ({ date }: { date: Date }) => {
    const { logs, updateLog, deleteLog } = useAppData();
    const { toast } = useToast();
    const [editingLogId, setEditingLogId] = useState<string | null>(null);
    const [editedLog, setEditedLog] = useState<LogEntry | null>(null);

    const dateKey = format(date, 'yyyy-MM-dd');
    const dayLogs = useMemo(() => logs[dateKey] || [], [logs, dateKey]);

    const handleEdit = (log: LogEntry) => {
        setEditingLogId(log.id);
        setEditedLog(log);
    };

    const handleCancel = () => {
        setEditingLogId(null);
        setEditedLog(null);
    };

    const handleSave = () => {
        if (editedLog) {
            updateLog(editedLog);
            toast({ title: "Success", description: "Log entry updated." });
            handleCancel();
        }
    };
    
    const handleDelete = (logId: string) => {
        deleteLog(logId, dateKey);
        toast({ title: "Success", description: "Log entry deleted." });
    };

    const handleInputChange = (field: keyof Omit<LogEntry, 'id' | 'date' | 'foodDescription'>, value: string) => {
        if (editedLog) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                setEditedLog({ ...editedLog, [field]: numValue });
            }
        }
    };

    const handleDescriptionChange = (value: string) => {
        if (editedLog) {
            setEditedLog({ ...editedLog, foodDescription: value });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Logs for {format(date, 'MMMM d, yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        {dayLogs.length === 0 && <TableCaption>No meals logged for this day.</TableCaption>}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Description</TableHead>
                                <TableHead>Calories</TableHead>
                                <TableHead>Carbs (g)</TableHead>
                                <TableHead>Fats (g)</TableHead>
                                <TableHead>Protein (g)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dayLogs.map((log) => (
                                <TableRow key={log.id}>
                                    {editingLogId === log.id && editedLog ? (
                                        <>
                                            <TableCell><Input value={editedLog.foodDescription} onChange={(e) => handleDescriptionChange(e.target.value)} /></TableCell>
                                            <TableCell><Input type="number" value={editedLog.calories} onChange={(e) => handleInputChange('calories', e.target.value)} className="w-20"/></TableCell>
                                            <TableCell><Input type="number" value={editedLog.carbs} onChange={(e) => handleInputChange('carbs', e.target.value)} className="w-20"/></TableCell>
                                            <TableCell><Input type="number" value={editedLog.fats} onChange={(e) => handleInputChange('fats', e.target.value)} className="w-20"/></TableCell>
                                            <TableCell><Input type="number" value={editedLog.protein} onChange={(e) => handleInputChange('protein', e.target.value)} className="w-20"/></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" size="icon" onClick={handleSave}><Save className="h-4 w-4 text-green-500" /></Button>
                                                    <Button variant="ghost" size="icon" onClick={handleCancel}><XCircle className="h-4 w-4 text-red-500" /></Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium">{log.foodDescription}</TableCell>
                                            <TableCell>{log.calories}</TableCell>
                                            <TableCell>{log.carbs}</TableCell>
                                            <TableCell>{log.fats}</TableCell>
                                            <TableCell>{log.protein}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(log)}><Edit2 className="h-4 w-4" /></Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete this log entry.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(log.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default function DailyLogsTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays /> Select a Date</CardTitle>
                <CardDescription>View your nutritional logs for any day.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    />
            </CardContent>
        </Card>
      
      {date && <LogList date={date} />}
    </div>
  );
}
