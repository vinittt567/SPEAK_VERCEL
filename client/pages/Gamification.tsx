import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Trophy, 
  Target, 
  Gift, 
  CheckCircle, 
  Star,
  Flame,
  Award,
  Palette,
  Quote,
  Volume2
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  total: number;
  completed: boolean;
}

interface Unlockable {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  type: 'theme' | 'quotes' | 'audio';
  icon: React.ReactNode;
}

export default function Gamification() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);

  const challenges: Challenge[] = [
    {
      id: "sleep-challenge",
      title: "7-Day Sleep Challenge",
      description: "Build consistency with short, focused challenges.",
      duration: "0/7 days",
      progress: 0,
      total: 7,
      completed: false
    },
    {
      id: "gratitude-journal",
      title: "5-Day Gratitude Journal",
      description: "Build consistency with short, focused challenges.",
      duration: "0/5 days", 
      progress: 0,
      total: 5,
      completed: false
    }
  ];

  const unlockables: Unlockable[] = [
    {
      id: "aurora-theme",
      title: "Aurora Theme",
      description: "A calming, aurora borealis theme.",
      cost: 150,
      unlocked: false,
      type: 'theme',
      icon: <Palette className="h-4 w-4" />
    },
    {
      id: "quotes-pack",
      title: "Quotes Pack", 
      description: "Daily motivational quotes • 30 pts",
      cost: 30,
      unlocked: false,
      type: 'quotes',
      icon: <Quote className="h-4 w-4" />
    },
    {
      id: "nature-audio",
      title: "Nature Audio",
      description: "Gentle ocean and forest sounds.",
      cost: 120,
      unlocked: false,
      type: 'audio',
      icon: <Volume2 className="h-4 w-4" />
    }
  ];

  const badges = [
    { name: "Starter", active: true },
    { name: "Explorer", active: false },
    { name: "Champion", active: false }
  ];

  const handleCheckIn = () => {
    if (!checkedInToday) {
      setCheckedInToday(true);
      setCurrentStreak(prev => prev + 1);
      setTotalPoints(prev => prev + 10);
    }
  };

  const handleMarkToday = (challengeId: string) => {
    // Handle marking challenge as complete for today
    console.log(`Marking challenge ${challengeId} as complete for today`);
  };

  const handleUnlock = (unlockableId: string, cost: number) => {
    if (totalPoints >= cost) {
      setTotalPoints(prev => prev - cost);
      // Handle unlocking the item
      console.log(`Unlocking ${unlockableId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gamification</h1>
          <p className="text-muted-foreground">Build healthy habits, earn rewards, and unlock calming experiences.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 px-3 py-2 rounded-full">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-semibold">{currentStreak} day streak</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded-full">
            <Star className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">{totalPoints} pts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Daily Check-in */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle className="text-lg">Daily Check-in</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Check in once per day to keep your streak and earn 10 points.
            </p>
            <div className="mb-4">
              <div className="text-2xl font-bold mb-1">{currentStreak} days</div>
              <div className="text-sm text-muted-foreground">Current streak</div>
            </div>
            <Button 
              onClick={handleCheckIn}
              disabled={checkedInToday}
              className="w-full"
              variant={checkedInToday ? "secondary" : "default"}
            >
              {checkedInToday ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Checked in today
                </>
              ) : (
                "Check in today"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Points & Badges */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <CardTitle className="text-lg">Points & Badges</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Earn points by engaging daily and completing challenges.
            </p>
            <div className="mb-4">
              <div className="text-2xl font-bold mb-1">{totalPoints} points</div>
              <div className="flex gap-1 mb-2">
                {badges.map((badge, index) => (
                  <Badge 
                    key={badge.name}
                    variant={badge.active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {badge.name}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Legend</div>
            </div>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <CardTitle className="text-lg">Challenges</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Build consistency with short, focused challenges.
            </p>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{challenge.title}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkToday(challenge.id)}
                      className="text-xs px-2 py-1 h-7"
                    >
                      Mark today
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{challenge.duration}</div>
                  <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unlockables */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <CardTitle className="text-lg">Unlockables</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Spend points to unlock new themes, quotes, and audio.
            </p>
            <div className="space-y-3">
              {unlockables.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={item.unlocked ? "secondary" : "default"}
                    onClick={() => !item.unlocked && handleUnlock(item.id, item.cost)}
                    disabled={item.unlocked || totalPoints < item.cost}
                    className="text-xs px-3 py-1 h-7"
                  >
                    {item.unlocked ? "Unlocked" : `Unlock`}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to earn points */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            How to earn points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Daily check-in: +10 pts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Complete challenges: +30 to +70 pts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Engage with resources or AI support regularly to build your streak and badges
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}