import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Book, ScrollText, Users } from 'lucide-react';

const JobSearchDashboard = () => {
  // Sample data - in real app, this would come from an API
  const jobs = [
    {
      title: 'AI Engineer',
      company: 'TechCorp BD',
      location: 'Dhaka, Bangladesh',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
      type: 'Full-time',
      experience: '2-4 years',
      salary: '৳80,000 - ৳120,000'
    },
    {
      title: 'Digital Marketing Specialist',
      company: 'GlobalReach Solutions',
      location: 'Remote',
      skills: ['SEO', 'Social Media Marketing', 'Content Strategy', 'Analytics'],
      type: 'Full-time',
      experience: '1-3 years',
      salary: '৳45,000 - ৳70,000'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupBD',
      location: 'Chittagong',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      type: 'Full-time',
      experience: '3-5 years',
      salary: '৳90,000 - ৳150,000'
    }
  ];

  const preparationGuides = {
    resume: [
      'Highlight relevant technical skills and certifications',
      'Include quantifiable achievements',
      'Customize for each role',
      'Use industry-specific keywords',
      'Keep it concise (1-2 pages)'
    ],
    interview: [
      'Research company background and values',
      'Prepare STAR method responses',
      'Practice technical assessments',
      'Prepare thoughtful questions for interviewer',
      'Review job description thoroughly'
    ],
    skills: {
      technical: [
        'Programming Languages',
        'Cloud Platforms',
        'Data Analysis',
        'Machine Learning',
        'DevOps Tools'
      ],
      soft: [
        'Communication',
        'Problem Solving',
        'Team Collaboration',
        'Time Management',
        'Adaptability'
      ]
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Latest Jobs
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <ScrollText className="w-4 h-4" />
            Resume Guide
          </TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Interview Prep
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <div className="grid gap-6">
            {jobs.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="text-sm text-gray-600">{job.company} • {job.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{job.salary}</div>
                      <div className="text-sm text-gray-600">{job.experience}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resume" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preparation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {preparationGuides.resume.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">{index + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Preparation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {preparationGuides.interview.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">{index + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preparationGuides.skills.technical.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Soft Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preparationGuides.skills.soft.map((skill, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSearchDashboard;
