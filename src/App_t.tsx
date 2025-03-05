import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import SettingsPage from './pages/SettingsPage';

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
    // <ClerkProvider publishableKey="pk_test_aW5ub2NlbnQtZm94aG91bmQtMTMuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <ThemeProvider defaultTheme="dark" storageKey="edtech-ui-theme">
        {/* Show login/signup form if user is signed out */}
        {/* <SignedOut>
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
              <h1 className="text-2xl font-bold mb-6 text-center">Welcome to QuizApp</h1>
              <div className="space-y-4">
                <SignIn afterSignInUrl="/" />
                <SignUp afterSignUpUrl="/" />
              </div>
            </div>
          </div>
        </SignedOut> */}

        {/* Show the main site if user is signed in */}
        {/* <SignedIn> */}
          <header className="p-4 flex justify-end">
            <UserButton />
          </header>
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
        {/* </SignedIn> */}
        <Toaster />
      </ThemeProvider>
    // {/* </ClerkProvider> */}
  );
}

export default App;