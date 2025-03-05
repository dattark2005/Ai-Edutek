import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { 
  Settings, Moon, Sun, Languages, Sliders, Bell, 
  UserCircle, Shield, Save, RotateCcw
} from 'lucide-react';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [studyDifficulty, setStudyDifficulty] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleResetSettings = () => {
    setStudyDifficulty('medium');
    setLanguage('english');
    setNotifications(true);
    setLowBandwidth(false);
    setAutoSave(true);
    setTheme('system');
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="appearance" className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="h-10 w-10 rounded-full bg-[#f8fafc] border flex items-center justify-center">
                        <Sun className="h-5 w-5 text-[#0f172a]" />
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="h-10 w-10 rounded-full bg-[#0f172a] border flex items-center justify-center">
                        <Moon className="h-5 w-5 text-[#f8fafc]" />
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                        theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#f8fafc] to-[#0f172a] border flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#0f172a] to-[#f8fafc]"></div>
                      </div>
                      <span className="text-sm font-medium">System</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Dark mode reduces eye strain and saves energy on devices with OLED screens.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="low-bandwidth">Low Bandwidth Mode</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">
                        Reduces animations and loads lighter resources
                      </p>
                    </div>
                    <Switch
                      id="low-bandwidth"
                      checked={lowBandwidth}
                      onCheckedChange={setLowBandwidth}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Study Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Study Plan Difficulty</Label>
                  <RadioGroup 
                    value={studyDifficulty} 
                    onValueChange={setStudyDifficulty}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="easy" 
                        id="easy" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="easy"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium">Easy</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="medium" 
                        id="medium" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="medium"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium">Medium</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem 
                        value="hard" 
                        id="hard" 
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor="hard"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium">Hard</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notifications">Notifications</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">
                        Receive reminders for daily study sessions
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="auto-save">Auto-Save Progress</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm text-muted-foreground">
                        Automatically save quiz progress
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Your Account</p>
                    <p className="text-sm text-muted-foreground">
                      student@example.com
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Data Privacy</Label>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Share learning analytics</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Appear on leaderboards</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Email notifications</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4 mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleResetSettings}
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button 
          className="flex items-center gap-2"
          onClick={handleSaveSettings}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;