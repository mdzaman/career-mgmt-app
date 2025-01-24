import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Map, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const CareerJourneyDashboard = () => {
  const [userData, setUserData] = useState({
    currentRole: "Junior Developer",
    targetRole: "Senior Full Stack Developer",
    completedSteps: 3,
    totalSteps: 8,
    skills: {
      current: ["JavaScript", "React", "Node.js"],
      target: ["System Design", "AWS", "Python", "Leadership"]
    },
    nextMilestone: "Complete System Design Course",
    progress: 45
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Journey Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Current Role</p>
              <h3 className="text-xl font-semibold">{userData.currentRole}</h3>
            </div>
            <div className="flex items-center text-blue-600">
              <ArrowRight className="h-6 w-6 mx-4" />
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Target Role</p>
              <h3 className="text-xl font-semibold text-blue-600">
                {userData.targetRole}
              </h3>
            </div>
          </div>
          
          <Progress value={userData.progress} className="h-2 mb-2" />
          <p className="text-sm text-gray-500 text-center">
            {userData.progress}% of your journey completed
          </p>
        </CardContent>
      </Card>

      {/* Skills Gap Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Current Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userData.skills.current.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Skills to Acquire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userData.skills.target.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="h-5 w-5 mr-2" />
            Your Career Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                <JourneyStep 
                  title="Complete System Design Course"
                  status="in-progress"
                  date="Current Focus"
                  description="Master system architecture and scalability principles"
                />
                <JourneyStep 
                  title="AWS Certification"
                  status="upcoming"
                  date="Next Quarter"
                  description="Get AWS Solutions Architect certification"
                />
                <JourneyStep 
                  title="Team Lead Project"
                  status="upcoming"
                  date="6 months"
                  description="Lead a team project to build leadership experience"
                />
                <JourneyStep 
                  title="Python Mastery"
                  status="completed"
                  date="Completed"
                  description="Advanced Python programming and frameworks"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recommended Next Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full justify-start text-left flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Start System Design Course on Coursera
            </Button>
            <Button variant="outline" className="w-full justify-start text-left flex items-center gap-2">
              <Award className="h-4 w-4" />
              Schedule AWS Certification Exam
            </Button>
            <Button variant="outline" className="w-full justify-start text-left flex items-center gap-2">
              <Target className="h-4 w-4" />
              Join System Design Discussion Group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const JourneyStep = ({ title, status, date, description }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500 animate-pulse';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="relative flex items-start ml-6">
      <div className={`absolute -left-9 mt-1 w-4 h-4 rounded-full ${getStatusStyles()}`} />
      <div>
        <div className="flex items-center">
          <h4 className="font-medium">{title}</h4>
          {status === 'completed' && (
            <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
          )}
        </div>
        <p className="text-sm text-gray-500">{date}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default CareerJourneyDashboard;
