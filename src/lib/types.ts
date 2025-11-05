export type UserProfile = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; 
  height: number; 
  dailyCalorieTarget: number;
  fitnessGoal: 'lose-weight' | 'maintain-weight' | 'gain-muscle';
};

export type MacroNutrients = {
  calories: number;
  carbs: number;
  fats: number;
  protein: number;
};

export type LogEntry = MacroNutrients & {
  id: string;
  foodDescription: string;
  date: string; // YYYY-MM-DD
};

export type Logs = {
  [date: string]: LogEntry[];
};
