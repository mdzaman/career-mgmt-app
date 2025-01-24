import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ComplianceMonitoringDashboard = () => {
  const [complianceData, setComplianceData] = useState({
    overallScore: 85,
    checks: [
      {
        category: 'Data Privacy',
        status: 'pass',
        score: 92,
        lastCheck: '2024-01-24T10:00:00Z',
        findings: []
      },
      {
        category: 'Access Control',
        status: 'warning',
        score: 78,
        lastCheck: '2024-01-24T10:00:00Z',
        findings: ['MFA not enabled for 3 users']
      },
      {
        category: 'Data Retention',
        status: 'pass',
        score: 95,
        lastCheck: '2024-01-24T10:00:00Z',
        findings: []
      }
    ],
    trends: [
      { date: '2024-01-20', score: 82 },
      { date: '2024-01-21', score: 83 },
      { date: '2024-01-22', score: 84 },
      { date: '2024-01-23', score: 85 },
      { date: '2024-01-24', score: 85 }
    ]
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Compliance Monitoring Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">
              {complianceData.overallScore}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">
              {complianceData.checks.reduce((acc, check) => acc + check.findings.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories Monitored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">
              {complianceData.checks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceData.checks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-semibold">{check.category}</div>
                    <div className="text-sm text-gray-500">
                      Last checked: {new Date(check.lastCheck).toLocaleString()}
                    </div>
                    {check.findings.length > 0 && (
                      <div className="text-sm text-red-500 mt-1">
                        {check.findings.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold">{check.score}%</div>
                    {getStatusIcon(check.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceMonitoringDashboard;