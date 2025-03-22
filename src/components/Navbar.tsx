import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Brain, Trophy, BookOpen, Settings } from 'lucide-react';
import { SignOutButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar items with paths and icons
  const navItems = [
    { name: 'Home', path: '/', icon: <Brain className="h-4 w-4 mr-2" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { name: 'Study Plan', path: '/study-plan', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: 'Assignment Upload', path: '/assignment-upload', icon: <BookOpen className="h-4 w-4 mr-2" /> }, // Added Assignment Upload link
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

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
          {/* Logout Button (Visible only when user is signed in) */}
          {user && (
            <SignOutButton>
              <Button variant="destructive" size="sm">
                Logout
              </Button>
            </SignOutButton>
          )}

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Mobile Menu Button (Hidden on larger screens) */}
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;