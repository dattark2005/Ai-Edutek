import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, BookOpen, Trophy, Zap } from 'lucide-react';
import { exportFirestoreDataToJson } from '@/lib/firebaseUtils';

interface HomePageProps {
  onStartQuiz: () => void;
}

const HomePage = ({ onStartQuiz }: HomePageProps) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const handleStartQuiz = () => {
    onStartQuiz();
    navigate('/quiz');
  };

  const features = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI-Powered Learning",
      description: "Our advanced AI analyzes your performance to create personalized study plans."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Adaptive Quizzes",
      description: "Questions adapt to your knowledge level, making learning efficient and effective."
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics and insights."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-12 pt-8 pb-16">
      <div className="text-center space-y-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Ace Your Learning with AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalized study plans powered by artificial intelligence to help you learn faster and more effectively.
        </p>
        <div className="pt-6">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 relative overflow-hidden group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleStartQuiz}
          >
            <span className="relative z-10 flex items-center">
              Start Quiz <Zap className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {features.map((feature, index) => (
          <Card key={index} className="border border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full max-w-5xl bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">1</div>
            <h3 className="font-semibold">Take the Quiz</h3>
            <p className="text-muted-foreground">Answer questions tailored to your knowledge level</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">2</div>
            <h3 className="font-semibold">Get AI Analysis</h3>
            <p className="text-muted-foreground">Our AI analyzes your strengths and weaknesses</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">3</div>
            <h3 className="font-semibold">Follow Your Plan</h3>
            <p className="text-muted-foreground">Study with a personalized learning path</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;