import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Bell, 
  Briefcase, 
  Users, 
  TrendingUp, 
  BookMarked,
  Star,
  MessageSquare,
  Building 
} from 'lucide-react';

const LinkedInJobTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Sample data - in a real app, this would come from LinkedIn API
  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Global',
      location: 'Dhaka, Bangladesh (Hybrid)',
      recruiter: 'Sarah Johnson',
      hiringManager: 'Michael Chen',
      postedDate: '2 days ago',
      applicants: 45,
      required_skills: [
        'React.js',
        'Node.js',
        'AWS',
        'System Design',
        'Team Leadership'
      ],
      preferred_skills: [
        'TypeScript',
        'Docker',
        'Kubernetes',
        'Microservices'
      ],
      description: 'Looking for a senior engineer to lead our core platform team...',
      qualifications: [
        'Bachelor's in Computer Science or related field',
        '5+ years of experience in software development',
        'Strong problem-solving skills'
      ],
      keySuccess: [
        'Previous experience leading teams',
        'Open source contributions',
        'System architecture experience'
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs BD',
      location: 'Remote',
      recruiter: 'David Wong',
      hiringManager: 'Lisa Anderson',
      postedDate: '5 days ago',
      applicants: 78,
      required_skills: [
        'Product Strategy',
        'Agile Methodology',
        'Data Analysis',
        'User Research'
      ],
      preferred_skills: [
        'SQL',
        'Product Analytics Tools',
        'UX Design',
        'Technical Background'
      ],
      description: 'Seeking an experienced product manager to drive our flagship product...',
      qualifications: [
        'MBA or equivalent experience',
        '3+ years in product management',
        'Strong analytical skills'
      ],
      keySuccess: [
        'Track record of successful product launches',
        'Experience with B2B products',
        'Strong stakeholder management'
      ]
    }
  ];

  const JobCard = ({ job, isSelected, onClick }) => (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isSelected ? 'border-2 border-blue-500' : ''
      }`}
      onClick={() => onClick(job)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription>{job.company}</CardDescription>
          </div>
          <Badge variant="secondary">{job.postedDate}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {job.applicants} applicants
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const JobDetails = ({ job }) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Key Decision Makers</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium">Recruiter</div>
                  <div className="text-sm text-gray-600">{job.recruiter}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <div>
                  <div className="font-medium">Hiring Manager</div>
                  <div className="text-sm text-gray-600">{job.hiringManager}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.required_skills.map((skill, index) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Preferred Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.preferred_skills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Keys to Success</h3>
        <ul className="space-y-2">
          {job.keySuccess.map((key, index) => (
            <li key={index} className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{key}</span>
            </li>
          ))}
        </ul>
      </div>

      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertTitle>Application Tip</AlertTitle>
        <AlertDescription>
          Customize your application by highlighting experiences that match the key success factors
          and required skills. Consider reaching out to the recruiter for additional insights.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">LinkedIn Job Tracker</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={() => searchJobs(searchQuery)}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Job Listings</h2>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Set Alert
            </Button>
          </div>
          
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job}
              isSelected={selectedJob?.id === job.id}
              onClick={setSelectedJob}
            />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          {selectedJob ? (
            <JobDetails job={selectedJob} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Select a job to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedInJobTracker;
