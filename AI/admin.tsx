import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, AlertTriangle, Users, Zap } from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    requestCount: 0,
    errorRate: 0,
    avgResponseTime: 0,
    activeUsers: 0
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchPerformance();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/admin/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/admin/model/performance');
      const data = await response.json();
      setPerformanceData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Service Dashboard</h1>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Requests</p>
                <h3 className="text-2xl font-bold">{metrics.requestCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Error Rate</p>
                <h3 className="text-2xl font-bold">{metrics.errorRate}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Avg Response Time</p>
                <h3 className="text-2xl font-bold">{metrics.avgResponseTime}ms</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <h3 className="text-2xl font-bold">{metrics.activeUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" />
                <Line type="monotone" dataKey="latency" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} variant={alert.type}>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
            {alerts.length === 0 && (
              <p className="text-gray-500">No active alerts</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
