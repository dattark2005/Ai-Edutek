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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface ResultPageProps {
  results: any;
}

const ResultPage = ({ results }: ResultPageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('');
  const [animatedScore, setAnimatedScore] = useState(0);
  const [studyPlan, setStudyPlan] = useState<any>(null);

  const score = results?.score || 0;
  const totalQuestions = results?.totalQuestions || 1;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  // Fetch study plan from Firebase
  useEffect(() => {
    const fetchStudyPlan = async () => {
      const userId = results?.userId;
      if (userId) {
        const studyPlanDoc = await getDoc(doc(db, 'studyPlans', userId));
        if (studyPlanDoc.exists()) {
          const data = studyPlanDoc.data();
          setStudyPlan(data);
          // Set the first course as the default active tab
          if (data.courses && data.courses.length > 0) {
            setActiveTab(data.courses[0].course);
          }
        }
      }
    };

    fetchStudyPlan();
  }, [results]);

  // Animate score counter
  useEffect(() => {
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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Personalized Study Plan</h1>

      {studyPlan?.courses && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Horizontal Scrollable Tabs */}
          <TabsList className="flex overflow-x-auto">
            {studyPlan.courses.map((course: any, index: number) => (
              <TabsTrigger key={index} value={course.course} className="flex items-center gap-2 whitespace-nowrap">
                <BookOpen className="h-4 w-4" />
                <span>{course.course}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Course-wise Study Plans */}
          {studyPlan.courses.map((course: any, index: number) => (
            <TabsContent key={index} value={course.course} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>{course.course}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Focus Areas */}
                  {course.focusAreas && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Focus Areas</h3>
                      <div className="grid gap-3">
                        {course.focusAreas.map((item: any, index: number) => (
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
                  )}

                  <Separator />

                  {/* Recommendations */}
                  {course.recommendations && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <span>Recommendations</span>
                      </h3>
                      <ul className="space-y-3">
                        {course.recommendations.map((recommendation: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Resources */}
                  {course.resources && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        <span>Resources</span>
                      </h3>
                      <div className="space-y-3">
                        {course.resources.map((resource: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium">{resource.category}</h4>
                            <ul className="space-y-2">
                              {resource.links.map((link: any, linkIndex: number) => (
                                <li key={linkIndex}>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {link.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Daily Study Schedule */}
                  {course.dailySchedule && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Daily Study Schedule</h3>
                      <div className="grid gap-3">
                        {course.dailySchedule.map((day: any, index: number) => (
                          <div key={index} className="space-y-3">
                            <h4 className="font-medium">{day.day}</h4>
                            {day.tasks.map((task: any, taskIndex: number) => (
                              <div key={taskIndex} className="flex items-center justify-between p-3 bg-card/50 border border-border/40 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary/10 p-2 rounded-full">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">{task.duration} minutes</p>
                                  </div>
                                </div>
                                <Badge variant={task.priority === 'High' ? 'default' : 'outline'}>
                                  {task.priority} Priority
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className="flex justify-center">
        <Button onClick={() => navigate('/quiz')} className="px-8">
          Take Another Quiz
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;