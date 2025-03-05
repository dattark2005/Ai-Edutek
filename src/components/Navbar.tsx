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

  const navItems = [
    { name: 'Home', path: '/', icon: <Brain className="h-4 w-4 mr-2" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-4 w-4 mr-2" /> },
    { name: 'Study Plan', path: '/results', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <span className="font-bold text-xl">LearnAI</span>
        </div>
        
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
        
        {user && (  // Show logout only when user is signed in
        <SignOutButton>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
            Logout
          </button>
        </SignOutButton>
      )}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;