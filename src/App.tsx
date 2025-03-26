import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import QuizPage from '@/pages/QuizPage';
import ResultPage from '@/pages/ResultPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import SettingsPage from '@/pages/SettingsPage';
import StudyPlanPage from '@/pages/StudyPlanPage';
import AssignmentUpload from '@/pages/AssignmentUpload';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentManagement from '@/pages/StudentManagement';
import ContentUpload from '@/pages/ContentUpload';
import AssignmentManagement from '@/pages/AssignmentManagement';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';

const clerkFrontendApi = "pk_test_aW5ub2NlbnQtZm94aG91bmQtMTMuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!clerkFrontendApi) {
  throw new Error("Missing Clerk Frontend API key. Please add API to your environment variables.");
}

function App() {
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user type on initial load
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType === 'student' || storedUserType === 'teacher') {
      setUserType(storedUserType);
    }
  }, []);

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

  const handleUserTypeSelect = (type: 'student' | 'teacher') => {
    setUserType(type);
    localStorage.setItem('userType', type);
    navigate('/sign-in');
  };

  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <ThemeProvider defaultTheme="dark" storageKey="edtech-ui-theme">
        <div className="min-h-screen bg-background">
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                  <header className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">EduAI</span>
                      </div>
                    </div>
                  </header>

                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to <span className="text-blue-600">EduAI</span>
                      </h1>
                      <p className="mt-4 text-xl text-gray-600">
                        Personalized education powered by artificial intelligence
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                      {/* Student Card */}
                      <button
                        onClick={() => handleUserTypeSelect('student')}
                        className="group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <GraduationCap className="h-12 w-12 text-blue-600" />
                          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h2>
                        <p className="text-gray-600">
                          Access your personalized study plans, take quizzes, and track your progress
                        </p>
                      </button>

                      {/* Teacher Card */}
                      <button
                        onClick={() => handleUserTypeSelect('teacher')}
                        className="group relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <BookOpen className="h-12 w-12 text-green-600" />
                          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Portal</h2>
                        <p className="text-gray-600">
                          Manage courses, create assessments, and monitor student performance
                        </p>
                      </button>
                    </div>
                  </main>

                  <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-gray-500">
                      © {new Date().getFullYear()} EduAI. All rights reserved.
                    </p>
                  </footer>
                </div>
              }
            />

            {/* Authentication Routes */}
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />

            {/* <Route
              path="/sign-in/*"
              element={<SignIn routing="path" path="/sign-in" />}
            />
            <Route
              path="/sign-up/*"
              element={<SignUp routing="path" path="/sign-up" />}
            /> */}

            {/* Protected Student Routes */}
            <Route
              path="/student/*"
              element={
                <SignedIn>
                  {userType === 'student' ? (
                    <StudentRoutes 
                      quizStarted={quizStarted}
                      quizCompleted={quizCompleted}
                      quizResults={quizResults}
                      onStartQuiz={handleStartQuiz}
                      onCompleteQuiz={handleCompleteQuiz}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </SignedIn>
              }
            />

            {/* Protected Teacher Routes */}
            <Route
              path="/teacher/*"
              element={
                <SignedIn>
                  {userType === 'teacher' ? (
                    <TeacherRoutes />
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </SignedIn>
              }
            />

            {/* Redirect signed out users to landing page */}
            <Route
              path="*"
              element={
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}

function StudentRoutes({
  quizStarted,
  quizCompleted,
  quizResults,
  onStartQuiz,
  onCompleteQuiz,
}: {
  quizStarted: boolean;
  quizCompleted: boolean;
  quizResults: any;
  onStartQuiz: () => void;
  onCompleteQuiz: (results: any) => void;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage onStartQuiz={onStartQuiz} quizData={undefined} />} />
          <Route path="/quiz" element={<QuizPage onComplete={onCompleteQuiz} />} />
          <Route path="/results" element={<ResultPage results={quizResults} />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/assignments" element={<AssignmentUpload />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/study-plan" element={<StudyPlanPage course="exampleCourse" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function TeacherRoutes() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<TeacherDashboard />} />
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/assignments" element={<AssignmentManagement />} />
          <Route path="/upload" element={<ContentUpload />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;