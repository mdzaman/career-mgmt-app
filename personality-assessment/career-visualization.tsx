import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  TrendingUp, 
  Globe, 
  BookOpen,
  Target,
  LineChart as ChartIcon,
  BarChart2,
  PieChart,
  DollarSign,
  GraduationCap,
  Building
} from 'lucide-react';

const CareerDashboard = ({ personalityType, careerData }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  // Transform salary data for visualization
  const salaryData = Object.entries(careerData.localIndustries).flatMap(([industry, data]) =>
    data.roles.map(role => ({
      role: role.title,
      salaryBDT: parseInt(role.avgSalary.split('-')[1].replace(/[^0-9]/g, '')),
      salaryUSD: role.globalSalary ? parseInt(role.globalSalary.split('-')[1].replace(/[^0-9]/g, '')) : 0,
      industry
    }))
  );

  // Skills frequency data for radar chart
  const skillsData = Object.entries(careerData.localIndustries).flatMap(([industry, data]) =>
    data.roles.flatMap(role => role.skills)
  ).reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  const radarData = Object.entries(skillsData).map(([skill, value]) => ({
    skill,
    frequency: (value / Object.keys(careerData.localIndustries).length) * 100
  }));

  // Growth trends data
  const growthTrendsData = [
    { year: 2024, localGrowth: 15, globalGrowth: 18 },
    { year: 2025, localGrowth: 22, globalGrowth: 25 },
    { year: 2026, localGrowth: 30, globalGrowth: 35 },
    { year: 2027, localGrowth: 45, globalGrowth: 48 },
    { year: 2028, localGrowth: 55, globalGrowth: 60 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Matched Careers
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(careerData.localIndustries).reduce((acc, industry) => 
                acc + industry.roles.length, 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your personality type
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Salary Range
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(salaryData.reduce((acc, role) => acc + role.salaryBDT, 0) / salaryData.length / 1000)}k BDT
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly average in Bangladesh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Growth Potential
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {growthTrendsData[growthTrendsData.length - 1].localGrowth}%
            </div>
            <p className="text-xs text-muted-foreground">
              Projected 5-year growth
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="salary">Salary Analysis</TabsTrigger>
          <TabsTrigger value="skills">Skills Map</TabsTrigger>
          <TabsTrigger value="growth">Growth Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Path Overview</CardTitle>
              <CardDescription>
                Based on your {personalityType} personality type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(careerData.localIndustries).map(([industry, data], index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {industry}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {data.roles.map((role, roleIndex) => (
                        <div key={roleIndex} className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">{role.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {role.avgSalary}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {role.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution</CardTitle>
              <CardDescription>
                Average monthly salaries across different roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Salary (BDT)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="salaryBDT" name="Local Salary" fill="#8884d8" />
                    <Bar dataKey="salaryUSD" name="Global Salary" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>
                Required skills frequency across career paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Skills" dataKey="frequency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <CardDescription>
                Projected career growth over the next 5 years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="localGrowth" name="Local Market" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="globalGrowth" name="Global Market" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Global Opportunities</CardTitle>
          <CardDescription>
            International career prospects and remote work opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerData.globalOpportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {opportunity.country}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  Average Salary: {opportunity.avgSalary}
                </div>
                <div className="mt-2">
                  <h4 className="font-medium">Common Roles:</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {opportunity.roles.map((role, roleIndex) => (
                      <Badge key={roleIndex}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  Visa Requirements: {opportunity.visaInfo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerDashboard;
