import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Brain, Trophy, BookOpen, Settings, Home, Upload, Users, ClipboardList } from 'lucide-react';
import { SignOutButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Get user type from localStorage
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType === 'student' || storedUserType === 'teacher') {
      setUserType(storedUserType);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Student Navbar items
  const studentNavItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { name: 'Study Plan', path: '/study-plan', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: 'Assignments', path: '/assignments', icon: <ClipboardList className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  // Teacher Navbar items
  const teacherNavItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Students', path: '/students', icon: <Users className="h-4 w-4 mr-2" /> },
    { name: 'Assignments', path: '/assignments', icon: <ClipboardList className="h-4 w-4 mr-2" /> },
    { name: 'Upload Content', path: '/upload', icon: <Upload className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  // Determine which nav items to display based on user type
  const navItems = userType === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold text-xl">LearnAI</span>
          {userType && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full ml-2">
              {userType === 'teacher' ? 'Teacher' : 'Student'}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="text-sm font-medium">
                {user.fullName || user.emailAddresses[0]?.emailAddress}
              </div>
            </div>
          )}

          {/* Logout Button */}
          {user && (
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </SignOutButton>
          )}

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Mobile Menu Button */}
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;