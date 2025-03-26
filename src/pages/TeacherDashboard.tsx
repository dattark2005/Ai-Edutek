import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  BarChart2,
  ClipboardCheck,
  MessageSquare,
  Video,
  LogOut,
} from 'lucide-react';

function TeacherDashboard() {
  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduAI</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Reports */}
          <Link
            to="/teacher/performance"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Student Performance Reports</h2>
            </div>
            <p className="text-gray-600">
              View detailed analytics and progress reports for your students
            </p>
          </Link>

          {/* Assignments & Quizzes */}
          <Link
            to="/teacher/assignments"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Assignments & Quiz Scores</h2>
            </div>
            <p className="text-gray-600">
              Review and grade student submissions and quiz results
            </p>
          </Link>

          {/* Feedback */}
          <Link
            to="/teacher/feedback"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Provide Feedback</h2>
            </div>
            <p className="text-gray-600">
              Send personalized feedback and guidance to your students
            </p>
          </Link>

          {/* Live Sessions */}
          <Link
            to="/teacher/live-sessions"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Video className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Schedule Live Sessions</h2>
            </div>
            <p className="text-gray-600">
              Create and manage VoIP classes and live teaching sessions
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;