"use client";

import { useState, useMemo } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { analyzeFood, AnalyzeFoodOutput } from '@/ai/flows/analyze-food-with-ai';
import { analyzeDietaryIntake } from '@/ai/flows/ai-powered-dietary-insights';
import type { LogEntry } from '@/lib/types';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Utensils, Zap, Sparkles, Plus, Loader2, Camera, Upload, BrainCircuit, Bot } from 'lucide-react';

const CalorieProgress = () => {
    const { profile, logs } = useAppData();
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todayLogs = logs[todayKey] || [];

    const dailyTotals = useMemo(() => {
        return todayLogs.reduce((acc, log) => {
            acc.calories += log.calories;
            acc.carbs += log.carbs;
            acc.fats += log.fats;
            acc.protein += log.protein;
            return acc;
        }, { calories: 0, carbs: 0, fats: 0, protein: 0 });
    }, [todayLogs]);

    const calorieProgress = profile ? (dailyTotals.calories / profile.dailyCalorieTarget) * 100 : 0;

    return (
        <Card>
            <CardContent className="space-y-4 pt-6">
                <div>
                    <div className="mb-2">
                        <span className="text-2xl font-bold text-foreground">{Math.round(dailyTotals.calories)}</span>
                        <span className="text-sm text-muted-foreground"> / {profile?.dailyCalorieTarget} kcal</span>
                    </div>
                    <Progress value={calorieProgress} className="w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Carbs</p>
                            <p className="text-2xl font-bold">{Math.round(dailyTotals.carbs)}g</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Fats</p>
                            <p className="text-2xl font-bold">{Math.round(dailyTotals.fats)}g</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Protein</p>
                            <p className="text-2xl font-bold">{Math.round(dailyTotals.protein)}g</p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
};

const FoodAnalyzer = () => {
    const { addLog } = useAppData();
    const { toast } = useToast();
    const [foodDescription, setFoodDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodOutput | null>(null);

    const handleAnalyze = async () => {
        if (!foodDescription.trim()) {
            toast({ title: "Error", description: "Please enter a food description.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeFood({ foodDescription });
            setAnalysisResult({
                totalCalories: Math.round(result.totalCalories),
                macros: {
                    carbs: Math.round(result.macros.carbs),
                    fats: Math.round(result.macros.fats),
                    protein: Math.round(result.macros.protein),
                }
            });
        } catch (error) {
            console.error(error);
            toast({ title: "Analysis Failed", description: "Could not analyze food. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleResultChange = (field: 'totalCalories' | 'carbs' | 'fats' | 'protein', value: string) => {
        if (!analysisResult) return;
        const numValue = Number(value);
        if (isNaN(numValue)) return;

        setAnalysisResult(prev => {
            if (!prev) return null;
            if (field === 'totalCalories') {
                return { ...prev, totalCalories: numValue };
            }
            return {
                ...prev,
                macros: { ...prev.macros, [field]: numValue }
            };
        });
    };
    
    const handleAddLog = () => {
        if (!analysisResult) return;
        
        const logEntry: Omit<LogEntry, 'id' | 'date'> = {
            foodDescription,
            calories: analysisResult.totalCalories,
            ...analysisResult.macros
        };
        addLog(logEntry);
        toast({ title: "Success", description: "Meal added to your daily log." });
        setFoodDescription('');
        setAnalysisResult(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Utensils /> Log a Meal with AI</CardTitle>
                <CardDescription>Describe your meal and let AI estimate the nutrition.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline"><Camera className="mr-2" /> Take Photo</Button>
                    <Button variant="outline"><Upload className="mr-2" /> Upload Image</Button>
                </div>
                <Textarea
                    placeholder="E.g., 1 bowl of oatmeal with a scoop of chocolate protein powder and a banana."
                    value={foodDescription}
                    onChange={(e) => setFoodDescription(e.target.value)}
                    rows={4}
                />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4">
                <Button onClick={handleAnalyze} disabled={isLoading || !foodDescription.trim()}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                    Analyze Food
                </Button>

                {analysisResult && (
                    <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
                        <h3 className="font-semibold text-center">Analysis Result (Editable)</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nutrient</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Calories</TableCell>
                                    <TableCell className="text-right"><Input type="number" value={analysisResult.totalCalories} onChange={(e) => handleResultChange('totalCalories', e.target.value)} className="w-24 h-8 text-right ml-auto" /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Carbs (g)</TableCell>
                                    <TableCell className="text-right"><Input type="number" value={analysisResult.macros.carbs} onChange={(e) => handleResultChange('carbs', e.target.value)} className="w-24 h-8 text-right ml-auto" /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Fats (g)</TableCell>
                                    <TableCell className="text-right"><Input type="number" value={analysisResult.macros.fats} onChange={(e) => handleResultChange('fats', e.target.value)} className="w-24 h-8 text-right ml-auto" /></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Protein (g)</TableCell>
                                    <TableCell className="text-right"><Input type="number" value={analysisResult.macros.protein} onChange={(e) => handleResultChange('protein', e.target.value)} className="w-24 h-8 text-right ml-auto" /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                         <Button onClick={handleAddLog} className="w-full">
                            <Plus className="mr-2"/> Add to Log
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

const DietaryInsights = () => {
    const { profile, logs } = useAppData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState<{ positiveFeedback: string; areasForImprovement: string } | null>(null);

    const handleAnalyzeDay = async () => {
        setIsLoading(true);
        setInsights(null);

        const todayKey = format(new Date(), 'yyyy-MM-dd');
        const todayLogs = logs[todayKey] || [];
        
        if (todayLogs.length === 0) {
            toast({ title: "Not enough data", description: "Log some meals first to get an analysis.", variant: "default" });
            setIsLoading(false);
            return;
        }

        if (!profile) {
            toast({ title: "Error", description: "User profile not found.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        const mealsString = todayLogs.map(log => log.foodDescription).join('\n- ');
        
        try {
            const result = await analyzeDietaryIntake({
                meals: mealsString,
                dailyCalorieTarget: profile.dailyCalorieTarget,
                fitnessGoal: profile.fitnessGoal
            });
            setInsights(result);
        } catch (error) {
            console.error(error);
            toast({ title: "Insight Failed", description: "Could not analyze your day. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Dietary Insights</CardTitle>
                <CardDescription>Get personalized feedback on your daily intake.</CardDescription>
            </CardHeader>
            <CardContent>
                {insights ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-300">What Went Well</h4>
                            <p className="text-sm text-green-700 dark:text-green-400">{insights.positiveFeedback}</p>
                        </div>
                         <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                            <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Areas for Improvement</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">{insights.areasForImprovement}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Click the button below to analyze today's meals and get feedback.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleAnalyzeDay} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Bot className="mr-2" />}
                    Analyze Today's Meals with AI
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function HomeTab() {
  return (
    <div className="space-y-6">
      <CalorieProgress />
      <Separator />
      <FoodAnalyzer />
      <Separator />
      <DietaryInsights />
    </div>
  );
}
