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
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut} from '@clerk/clerk-react';

// const clerkFrontendApi = import.meta.env.CLERK_PUBLISHABLE_KEY || '';

const  clerkFrontendApi = "pk_test_aW5ub2NlbnQtZm94aG91bmQtMTMuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Frontend API key. Please add API to your environment variables.");
}

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
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <ThemeProvider defaultTheme="dark" storageKey="edtech-ui-theme">
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 py-8">
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
  
            <SignedIn>
                <Navbar />
              <Routes>
                <Route 
                  path="/" 
                  element={<HomePage onStartQuiz={handleStartQuiz} quizData={undefined} />} 
                />
                <Route 
                  path="/quiz" 
                  element={<QuizPage onComplete={handleCompleteQuiz} />} 
                />
                <Route 
                  path="/results" 
                  element={quizCompleted ? 
                    <ResultPage results={quizResults} /> : 
                    <Navigate to="/" replace />
                  } 
                />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SignedIn>
  
            <Routes>
              <Route 
                path="/sign-in/*" 
                element={<SignIn routing="path" path="/sign-in" />} 
              />
              <Route 
                path="/sign-up/*" 
                element={<SignUp routing="path" path="/sign-up" />} 
              />
            </Routes>
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  );
}  

export default App;