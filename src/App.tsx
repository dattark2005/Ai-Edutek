import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import QuizPage from '@/pages/QuizPage';
import ResultPage from '@/pages/ResultPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setQuizResults(null);
  };

  const handleCompleteQuiz = (results: any) => {
    setQuizStarted(false);
    setQuizCompleted(true);
    setQuizResults(results);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="edtech-ui-theme">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage onStartQuiz={handleStartQuiz} />} 
            />
            <Route 
              path="/quiz" 
              element={
                <QuizPage 
                  onComplete={handleCompleteQuiz} 
                />
              } 
            />
            <Route 
              path="/results" 
              element={
                quizCompleted ? 
                <ResultPage results={quizResults} /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;