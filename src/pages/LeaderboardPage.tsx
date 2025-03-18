import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Trophy, Medal, Search, ArrowUpDown } from 'lucide-react';
import { db } from '@/firebase'; // Import Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions

interface QuizResult {
  userId: string;
  userEmail: string;
  userName: string;
  course: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

interface LeaderboardEntry {
  userId: string;
  userEmail: string;
  userName: string;
  course: string;
  averageScore: number;
  totalQuizzes: number;
}

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<{ [course: string]: LeaderboardEntry[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('averageScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz results and generate leaderboard
  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const quizResultsRef = collection(db, 'quizResults');
        const quizResultsSnapshot = await getDocs(quizResultsRef);
        const quizResults: QuizResult[] = quizResultsSnapshot.docs.map((doc) => doc.data() as QuizResult);

        // Group quiz results by course and user
        const courseWiseResults: { [course: string]: { [userId: string]: QuizResult[] } } = {};

        quizResults.forEach((result) => {
          const { course, userId } = result;
          if (!courseWiseResults[course]) {
            courseWiseResults[course] = {};
          }
          if (!courseWiseResults[course][userId]) {
            courseWiseResults[course][userId] = [];
          }
          courseWiseResults[course][userId].push(result);
        });

        // Calculate average score for each user in each course
        const leaderboard: { [course: string]: LeaderboardEntry[] } = {};

        Object.keys(courseWiseResults).forEach((course) => {
          const userResults = courseWiseResults[course];
          const entries: LeaderboardEntry[] = [];

          Object.keys(userResults).forEach((userId) => {
            const results = userResults[userId];
            const totalScore = results.reduce((sum, result) => sum + result.score, 0);
            const averageScore = totalScore / results.length;
            entries.push({
              userId,
              userEmail: results[0].userEmail,
              userName: results[0].userName,
              course,
              averageScore,
              totalQuizzes: results.length,
            });
          });

          // Sort entries by average score
          entries.sort((a, b) => b.averageScore - a.averageScore);
          leaderboard[course] = entries;
        });

        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        setError('Failed to fetch leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResults();
  }, []);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Filter leaderboard data based on search query
  const filteredData = useMemo(() => {
    return (course: string) => {
      const data = leaderboardData[course];
      if (!data) return [];
  
      return data.filter((entry) =>
        (entry.userName || '').toLowerCase().includes((searchQuery || '').toLowerCase())
      );
    };
  }, [leaderboardData, searchQuery]);

  // Sort leaderboard data
  const sortedData = useMemo(() => {
    return (course: string) => {
      const data = filteredData(course);
      if (!data) return [];

      return [...data].sort((a, b) => {
        const factor = sortDirection === 'desc' ? -1 : 1;
        return factor * (a[sortBy as keyof typeof a] as number - (b[sortBy as keyof typeof b] as number));
      });
    };
  }, [filteredData, sortBy, sortDirection]);

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Render empty state
  if (Object.keys(leaderboardData).length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <p>No leaderboard data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See how you compare with other learners
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue={Object.keys(leaderboardData)[0]} className="space-y-6">
        <TabsList>
          {Object.keys(leaderboardData).map((course) => (
            <TabsTrigger key={course} value={course} className="flex items-center gap-2">
              <span>{course}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(leaderboardData).map((course) => (
          <TabsContent key={course} value={course} className="space-y-6">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>{course} Leaderboard</CardTitle>
                <CardDescription>
                  Rankings based on average quiz scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
                    <div className="col-span-1 flex items-center justify-center">Rank</div>
                    <div className="col-span-5">User</div>
                    <div
                      className="col-span-2 flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort('averageScore')}
                    >
                      Score%
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                    <div
                      className="col-span-2 flex items-center gap-1 cursor-pointer"
                      onClick={() => handleSort('totalQuizzes')}
                    >
                      Quizzes
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                    <div className="col-span-2">Email</div>
                  </div>

                  <div className="divide-y">
                    {sortedData(course).map((entry, index) => (
                      <LeaderboardRow key={entry.userId} entry={entry} index={index} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Reusable component for leaderboard row
const LeaderboardRow = ({ entry, index }: { entry: LeaderboardEntry; index: number }) => {
  return (
    <div
      className={`grid grid-cols-12 gap-2 p-4 items-center transition-all duration-300 ${
        entry.userName === 'You' ? 'bg-primary/5' : ''
      }`}
    >
      <div className="col-span-1 flex justify-center">
        {index < 3 ? (
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full
            ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
              index === 1 ? 'bg-gray-300/20 text-gray-500' : 
              'bg-amber-600/20 text-amber-600'}
          `}>
            <Medal className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
            {index + 1}
          </div>
        )}
      </div>

      <div className="col-span-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
          {/* Placeholder for user avatar */}
        </div>
        <div>
          <p className={`font-medium ${entry.userName === 'You' ? 'text-primary' : ''}`}>
            {entry.userName}
          </p>
        </div>
      </div>

      <div className="col-span-2 font-semibold">
        {entry.averageScore.toFixed(2)}%
      </div>

      <div className="col-span-2">
        {entry.totalQuizzes}
      </div>

      <div className="col-span-2 text-sm text-muted-foreground">
        {entry.userEmail}
      </div>
    </div>
  );
};

export default LeaderboardPage;