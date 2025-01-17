import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, BookOpen, Briefcase, Rocket, Target, Users, Brain, Globe } from 'lucide-react';

const RewardSystem = () => {
  // Sample user progress data
  const [userProgress, setUserProgress] = useState({
    level: 3,
    experience: 2750,
    nextLevelExp: 3000,
    achievements: [
      { id: 1, name: 'Profile Pioneer', description: 'Completed profile setup with all sections', icon: <Users className="w-6 h-6" /> },
      { id: 2, name: 'Skill Seeker', description: 'Completed first skill assessment', icon: <Brain className="w-6 h-6" /> },
    ],
    badges: [
      { id: 1, name: 'Fast Learner', tier: 'bronze', progress: 75 },
      { id: 2, name: 'Network Builder', tier: 'silver', progress: 45 },
    ]
  });

  // Achievement categories and their respective icons
  const achievementCategories = {
    personal: <Target className="w-6 h-6 text-blue-500" />,
    academic: <BookOpen className="w-6 h-6 text-green-500" />,
    professional: <Briefcase className="w-6 h-6 text-purple-500" />,
    entrepreneurial: <Rocket className="w-6 h-6 text-orange-500" />,
    global: <Globe className="w-6 h-6 text-cyan-500" />
  };

  // Badge tiers with their colors
  const badgeTiers = {
    bronze: 'bg-orange-200',
    silver: 'bg-gray-200',
    gold: 'bg-yellow-200',
    platinum: 'bg-blue-200'
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Career Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Level {userProgress.level}</span>
              <span>{userProgress.experience} / {userProgress.nextLevelExp} XP</span>
            </div>
            <Progress value={(userProgress.experience / userProgress.nextLevelExp) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProgress.achievements.map(achievement => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {achievement.icon}
                <div>
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Skill Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProgress.badges.map(badge => (
              <div key={badge.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${badgeTiers[badge.tier]} text-gray-800`}>
                    {badge.name}
                  </Badge>
                  <span className="text-sm text-gray-600">{badge.tier}</span>
                </div>
                <Progress value={badge.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardSystem;
