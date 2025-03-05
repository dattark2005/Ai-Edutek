import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Search, Users, Calendar, ArrowUpDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock leaderboard data
const initialLeaderboardData = [
  { id: 1, name: 'Alex Johnson', score: 98, streak: 15, badges: ['Dark Mode User', 'Consistent Learner'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80' },
  { id: 2, name: 'Jamie Smith', score: 95, streak: 7, badges: ['Low Bandwidth'], avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80' },
  { id: 3, name: 'Taylor Wilson', score: 92, streak: 12, badges: ['Dark Mode User'], avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80' },
  { id: 4, name: 'Morgan Lee', score: 90, streak: 5, badges: ['Consistent Learner'], avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80' },
  { id: 5, name: 'Jordan Rivera', score: 88, streak: 9, badges: ['Dark Mode User', 'Low Bandwidth'], avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&q=80' },
  { id: 6, name: 'Casey Kim', score: 85, streak: 3, badges: ['Dark Mode User'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80' },
  { id: 7, name: 'Riley Cooper', score: 82, streak: 6, badges: ['Consistent Learner'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80' },
  { id: 8, name: 'Avery Martinez', score: 80, streak: 4, badges: ['Low Bandwidth'], avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&q=80' },
  { id: 9, name: 'Quinn Taylor', score: 78, streak: 8, badges: ['Dark Mode User'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80' },
  { id: 10, name: 'You', score: 75, streak: 2, badges: ['Dark Mode User'], avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&q=80' },
];

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState(initialLeaderboardData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');
  const [animateRankings, setAnimateRankings] = useState(false);
  
  // Filter leaderboard data based on search query
  const filteredData = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort leaderboard data
  const sortedData = [...filteredData].sort((a, b) => {
    const factor = sortDirection === 'desc' ? -1 : 1;
    return factor * (a[sortBy as keyof typeof a] as number - (b[sortBy as keyof typeof b] as number));
  });
  
  // Simulate leaderboard updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update scores to simulate live updates
      setLeaderboardData(prevData => {
        const newData = [...prevData];
        const randomIndex = Math.floor(Math.random() * newData.length);
        const scoreChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
        
        if (randomIndex !== newData.length - 1) { // Don't update "You"
          newData[randomIndex] = {
            ...newData[randomIndex],
            score: Math.max(0, Math.min(100, newData[randomIndex].score + scoreChange))
          };
        }
        
        setAnimateRankings(true);
        setTimeout(() => setAnimateRankings(false), 500);
        
        return newData;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Top performers for chart
  const topPerformers = sortedData.slice(0, 5).map(user => ({
    name: user.name === 'You' ? 'You' : user.name.split(' ')[0],
    score: user.score
  }));
  
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
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>All Users</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Weekly Top</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                Updated in real-time based on quiz performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
                  <div className="col-span-1 flex items-center justify-center">Rank</div>
                  <div className="col-span-5">User</div>
                  <div 
                    className="col-span-2 flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    Score
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div 
                    className="col-span-2 flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSort('streak')}
                  >
                    Streak
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                  <div className="col-span-2">Badges</div>
                </div>
                
                <div className="divide-y">
                  {sortedData.map((user, index) => (
                    <div 
                      key={user.id}
                      className={`grid grid-cols-12 gap-2 p-4 items-center transition-all duration-300 ${
                        user.name === 'You' ? 'bg-primary/5' : ''
                      } ${animateRankings ? 'animate-pulse' : ''}`}
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
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className={`font-medium ${user.name === 'You' ? 'text-primary' : ''}`}>
                            {user.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-span-2 font-semibold">
                        {user.score}%
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          <div className="bg-primary/10 p-1 rounded">
                            <Calendar className="h-3 w-3 text-primary" />
                          </div>
                          <span>{user.streak} days</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {user.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs py-0">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Score comparison of leading students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPerformers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar 
                      dataKey="score" 
                      fill="hsl(var(--chart-3))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Challenge Leaders</CardTitle>
              <CardDescription>
                Top performers in this week's learning challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sortedData.slice(0, 5).map((user, index) => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === 'You' ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                          index === 1 ? 'bg-gray-300/20 text-gray-500' : 
                          index === 2 ? 'bg-amber-600/20 text-amber-600' :
                          'bg-muted text-muted-foreground'}
                      `}>
                        {index === 0 ? <Trophy className="h-4 w-4" /> : 
                         index < 3 ? <Medal className="h-4 w-4" /> : 
                         index + 1}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
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
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.score}%</div>
                      <div className="text-xs text-muted-foreground">Weekly Score</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">View All Weekly Rankings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardPage;