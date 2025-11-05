# **App Name**: CalCounter AI

## Core Features:

- User Profile Setup: Onboarding process to collect user details (Name, Age, Gender, Weight, Height, Daily Calorie Target, Fitness Goal).
- Data Persistence: Local storage of user profile and daily log information on the device. Note: Database support will depend on which PWA frameworks you select, such as IndexedDB, Web SQL, or similar
- Home Tab - Calorie Progress: Display a progress bar visualizing calories consumed vs. daily goal, along with boxes showing Carbs, Fats, and Protein breakdown.
- Image Analysis: Allow users to upload an image or take a photo of their meal.
- Food Description and AI Analysis: Enable users to describe their food intake; leverage Gemini to analyze the description and estimate total calories, macros, etc., presenting it in a table. This feature uses Gemini as a tool.
- Manual Macro Editing: Give the user the ability to edit estimated calories and macros from the food description or photo. And after editing Save to daily logs
- AI-Powered Dietary Insights: Provide personalized feedback and suggestions to users on their past, present, and future calorie consumption with personalized recommendations using generative AI.
- My Logs Tab: Display daily logs on the main page of this tab; integrate a calendar for date selection to view past logs.
- Manual Log Editing: Give the user the ability to manually edit logs and add or remove items.

## Style Guidelines:

- Primary color: Dark gray (#333333) for a modern feel.
- Background color: Light gray (#F0F0F0) for a clean, minimal look.
- Accent color: A slightly darker gray (#4F4F4F) to provide contrast for interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, neutral look.
- Use simple, line-based icons for navigation and data representation.
- Employ a clean and minimalist layout, with clear sections and whitespace for readability.
- Incorporate subtle animations for user interactions (e.g., when adding or editing logs).