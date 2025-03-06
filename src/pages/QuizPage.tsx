import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const API_URL = 'https://quizapi.io/api/v1/questions';
const API_KEY = 'E0ncEEJKUx9OB83tgUAWh0czgsba2QqYhaWdxJL5';

// List of available categories
const CATEGORIES = [
  'Linux',
  'DevOps',
  'Docker',
  'SQL',
];

interface QuizQuestion {
  id: number;
  question: string;
  answers: { [key: string]: string | null };
  correct_answer: string | null;
}

interface FormattedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizPageProps {
  onComplete: (results: any) => void; // Ensure onComplete is properly typed
}

const QuizPage: React.FC<QuizPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showScorePopup, setShowScorePopup] = useState<boolean>(false);
  const [showAnswersPopup, setShowAnswersPopup] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Fetch quiz questions based on the selected category
  const fetchQuiz = async (category: string) => {
    try {
      const response = await fetch(`${API_URL}?category=${category}&limit=15`, {
        headers: { 'X-Api-Key': API_KEY },
      });
      const data: QuizQuestion[] = await response.json();

      const formattedQuestions: FormattedQuestion[] = data.map((q) => {
        const options = Object.values(q.answers).filter((option): option is string => option !== null);
        const correctAnswerKey = q.correct_answer;
        const correctIndex = Object.keys(q.answers).findIndex((key) => key === correctAnswerKey);

        return {
          id: q.id,
          question: q.question,
          options: options,
          correctAnswer: correctIndex !== -1 ? correctIndex : 0, // Ensure a valid index
        };
      });

      setQuestions(formattedQuestions);
      setAnswers(Array(formattedQuestions.length).fill(null));
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  // Start the quiz when a category is selected
  const handleStartQuiz = () => {
    if (selectedCategory) {
      fetchQuiz(selectedCategory);
      setQuizStarted(true);
    }
  };

  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const handleNextQuestion = useCallback(async () => {
    if (selectedOption === null) return;
  
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);
  
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setIsSubmitting(true);
      const correctAnswers = newAnswers.filter((ans, i) => ans === questions[i].correctAnswer).length;
      setScore(correctAnswers);
      setShowScorePopup(true);
  
      // Call onComplete with the quiz results
      onComplete({ score: correctAnswers, total: totalQuestions });
  
      // Save quiz results to Firestore
      try {
        const userId = user?.id; // Get the user ID from Clerk
        if (!userId) throw new Error("User not authenticated");
  
        const quizResults = {
          userId,
          score: correctAnswers,
          totalQuestions,
          answers: newAnswers,
          questions: questions.map((q, i) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: newAnswers[i],
          })),
          timestamp: new Date().toISOString(),
        };
  
        // Save to Firestore
        await setDoc(doc(db, 'quizResults', `${userId}_${Date.now()}`), quizResults);
        console.log("Quiz results saved to Firestore");
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    }
  }, [currentQuestion, selectedOption, answers, totalQuestions, questions, onComplete, user]);


  const fetchQuizResults = async (userId: string) => {
    try {
      const q = query(collection(db, 'quizResults'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => doc.data());
      return results;
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      return [];
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  useEffect(() => {
    let timerId: number;
    if (timeLeft > 0 && !isSubmitting) {
      timerId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1 && selectedOption === null) {
            handleNextQuestion();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [timeLeft, selectedOption, isSubmitting, handleNextQuestion]);

  const handleOptionSelect = (index: number) => setSelectedOption(index);

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold">Adaptive Learning Quiz</h2>
          <div className="flex flex-col space-y-4">
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleStartQuiz} disabled={!selectedCategory}>
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center text-gray-600">Loading quiz...</div>;
  }

  const currentQuizItem = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Adaptive Learning Quiz</h2>
          <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full border border-border/40">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={cn("font-mono", timeLeft < 10 && "text-destructive animate-pulse")}>{timeLeft}s</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border border-border/40 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>{`${currentQuestion + 1} of ${totalQuestions}: ${currentQuizItem.question}`}</span>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid gap-4">
            {currentQuizItem.options.map((option, index) => (
              <Button 
                key={index} 
                variant={selectedOption === index ? "default" : "outline"} 
                onClick={() => handleOptionSelect(index)}
                className={cn(
                  "text-left w-full justify-start",
                  index === 0 && "border-orange-500",
                  index === 1 && "border-green-500",
                  index === 2 && "border-yellow-500",
                  index === 3 && "border-red-500"
                )}
              >
                {String.fromCharCode(65 + index)}. {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNextQuestion} disabled={isSubmitting}>
            {currentQuestion < totalQuestions - 1 ? (
              <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              'Submit Quiz'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Score Popup */}
      <Dialog open={showScorePopup} onOpenChange={setShowScorePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Quiz Score</DialogTitle>
          </DialogHeader>
          <p>You scored {score} out of {totalQuestions}!</p>
          <DialogFooter>
            <Button onClick={() => setShowAnswersPopup(true)}>Show Correct Answers</Button>
            <Button onClick={() => navigate('/results')}>View Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Correct Answers Popup */}
      <Dialog open={showAnswersPopup} onOpenChange={setShowAnswersPopup}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Correct Answers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 border rounded-lg bg-card shadow-sm">
                  <p className="font-semibold text-lg">{`Q${i + 1}: ${q.question}`}</p>
                  <p className="text-green-600 mt-2">
                    <span className="font-medium">Correct Answer:</span> {String.fromCharCode(65 + q.correctAnswer)}. {q.options[q.correctAnswer]}
                  </p>
                  <p className={cn("mt-2", isCorrect ? "text-green-600" : "text-red-600")}>
                    <span className="font-medium">Your Answer:</span> {userAnswer !== null ? `${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}` : "No answer selected"}
                  </p>
                </div>
              );
            })}
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowAnswersPopup(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPage;