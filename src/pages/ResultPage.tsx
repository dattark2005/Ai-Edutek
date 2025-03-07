import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, BarChart, CheckCircle, XCircle, Lightbulb, Award, Trophy } from 'lucide-react';
import { 
  LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Mock performance data
const performanceData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 59 },
  { day: 'Wed', score: 80 },
  { day: 'Thu', score: 81 },
  { day: 'Fri', score: 76 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 90 },
];

const strengthsWeaknesses = [
  { category: 'Time Management', strength: 85, weakness: 15 },
  { category: 'Memory Techniques', strength: 60, weakness: 40 },
  { category: 'Active Learning', strength: 75, weakness: 25 },
  { category: 'Note Taking', strength: 45, weakness: 55 },
  { category: 'Focus & Attention', strength: 70, weakness: 30 },
];

// Mock leaderboard data
const leaderboardData = [
  { id: 1, name: 'Alex Johnson', score: 98, badges: ['Dark Mode User', 'Consistent Learner'] },
  { id: 2, name: 'Jamie Smith', score: 95, badges: ['Low Bandwidth'] },
  { id: 3, name: 'Taylor Wilson', score: 92, badges: ['Dark Mode User'] },
  { id: 4, name: 'Morgan Lee', score: 90, badges: ['Consistent Learner'] },
  { id: 5, name: 'You', score: 85, badges: ['Dark Mode User'] },
];

interface ResultPageProps {
  results: any;
}

const ResultPage = ({ results }: ResultPageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const score = results?.correctAnswers || 4;
  const totalQuestions = results?.totalQuestions || 5;
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    // Animate score counter
    const duration = 1500;
    const interval = 20;
    const steps = duration / interval;
    const increment = scorePercentage / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= scorePercentage) {
        setAnimatedScore(scorePercentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [scorePercentage]);
  
  useEffect(() => {
    // Show leaderboard with delay for animation effect
    const timer = setTimeout(() => {
      setShowLeaderboard(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-500';
    if (scorePercentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreMessage = () => {
    if (scorePercentage >= 80) return 'Excellent! You\'re mastering this material.';
    if (scorePercentage >= 60) return 'Good job! You\'re on the right track.';
    return 'Keep practicing! You\'ll improve with more study.';
  };
  
  const getRecommendations = () => {
    if (scorePercentage >= 80) {
      return [
        'Challenge yourself with advanced material',
        'Try teaching these concepts to others',
        'Explore related topics to broaden your knowledge'
      ];
    }
    if (scorePercentage >= 60) {
      return [
        'Review the questions you missed',
        'Practice active recall techniques',
        'Try spaced repetition for better retention'
      ];
    }
    return [
      'Focus on understanding core concepts first',
      'Use flashcards for key terms and definitions',
      'Schedule regular, shorter study sessions'
    ];
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Personalized Study Plan</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Study Plan</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your results from today's assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - animatedScore / 100)}`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor()}`}>
                        {animatedScore}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {score} of {totalQuestions} correct
                      </span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-center font-medium">
                    {getScoreMessage()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Strengths & Areas for Improvement</CardTitle>
              <CardDescription>Based on your quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={strengthsWeaknesses}
                    layout="vertical"
                    barGap={0}
                    barCategoryGap={16}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="strength" 
                      name="Strengths" 
                      fill="hsl(var(--chart-2))" 
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                      dataKey="weakness" 
                      name="Areas to Improve" 
                      fill="hsl(var(--chart-5))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI-Generated Study Plan</span>
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Focus Areas</h3>
                <div className="grid gap-3">
                  {strengthsWeaknesses.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="text-muted-foreground">{item.strength}%</span>
                      </div>
                      <Progress value={item.strength} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Recommendations</span>
                </h3>
                <ul className="space-y-3">
                  {getRecommendations().map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Daily Study Schedule</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Time Management Techniques</p>
                        <p className="text-sm text-muted-foreground">25 minutes</p>
                      </div>
                    </div>
                    <Badge>High Priority</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Active Learning Exercises</p>
                        <p className="text-sm text-muted-foreground">20 minutes</p>
                      </div>
                    </div>
                    <Badge variant="outline">Medium Priority</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Note-Taking Practice</p>
                        <p className="text-sm text-muted-foreground">15 minutes</p>
                      </div>
                    </div>
                    <Badge variant="outline">Medium Priority</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button onClick={() => navigate('/quiz')} className="px-8">
              Take Another Quiz
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Leaderboard</span>
              </CardTitle>
              <CardDescription>
                See how you compare with other learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                      showLeaderboard 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: `${index * 200}ms`,
                      backgroundColor: user.name === 'You' ? 'hsl(var(--primary)/0.1)' : 'transparent',
                      border: '1px solid hsl(var(--border)/0.4)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index < 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>
                          {user.name}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {user.badges.map((badge, i) => (
                            <Badge key={i} variant="outline" className="text-xs py-0">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold">
                      {user.score}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Ranking</CardTitle>
              <CardDescription>How you compare to others</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={leaderboardData.map(user => ({ name: user.name, score: user.score }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar 
                      dataKey="score" 
                      fill={(entry) => entry.name === 'You' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-3))'}
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultPage;