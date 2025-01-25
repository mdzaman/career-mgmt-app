import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Key, Settings, Activity, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const APIAdminDashboard = () => {
  const [apis, setApis] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [selectedApi, setSelectedApi] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAPIs();
    fetchTokens();
    fetchMetrics();
  }, []);

  const fetchAPIs = async () => {
    try {
      const response = await fetch('/api/admin/apis');
      const data = await response.json();
      setApis(data);
    } catch (error) {
      console.error('Error fetching APIs:', error);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/admin/tokens');
      const data = await response.json();
      setTokens(data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const generateToken = async (apiId) => {
    try {
      const response = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiId })
      });
      const data = await response.json();
      if (response.ok) {
        fetchTokens(); // Refresh tokens list
      }
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  const revokeToken = async (tokenId) => {
    try {
      const response = await fetch(`/api/admin/tokens/${tokenId}/revoke`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchTokens(); // Refresh tokens list
      }
    } catch (error) {
      console.error('Error revoking token:', error);
    }
  };

  const updateApiConfig = async (apiId, config) => {
    try {
      const response = await fetch(`/api/admin/apis/${apiId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        fetchAPIs(); // Refresh APIs list
      }
    } catch (error) {
      console.error('Error updating API config:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">API Administration</h1>
      </div>

      <Tabs defaultValue="apis" className="w-full">
        <TabsList>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="tokens">Access Tokens</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="apis">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>API Endpoints</CardTitle>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Search APIs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New API
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">API Name</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Endpoint</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Method</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apis
                      .filter(api => 
                        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        api.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(api => (
                        <tr key={api.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{api.name}</td>
                          <td className="px-4 py-2">{api.endpoint}</td>
                          <td className="px-4 py-2">{api.method}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              api.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {api.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => setSelectedApi(api)}>
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => generateToken(api.id)}>
                                Generate Token
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Access Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Token ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">API</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Created</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Expires</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map(token => (
                      <tr key={token.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{token.id}</td>
                        <td className="px-4 py-2">{token.apiName}</td>
                        <td className="px-4 py-2">{new Date(token.created).toLocaleString()}</td>
                        <td className="px-4 py-2">{new Date(token.expires).toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            token.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {token.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Button variant="outline" size="sm" 
                            onClick={() => token.status === 'active' ? revokeToken(token.id) : null}>
                            {token.status === 'active' ? 'Revoke' : 'Revoked'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.usage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="latency" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedApi && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rate Limiting</label>
                    <Input
                      type="number"
                      value={selectedApi.rateLimit}
                      onChange={(e) => updateApiConfig(selectedApi.id, {
                        ...selectedApi,
                        rateLimit: parseInt(e.target.value)
                      })}
                      className="w-48"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cache Duration (seconds)</label>
                    <Input
                      type="number"
                      value={selectedApi.cacheDuration}
                      onChange={(e) => updateApiConfig(selectedApi.id, {
                        ...selectedApi,
                        cacheDuration: parseInt(e.target.value)
                      })}
                      className="w-48"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Timeout (seconds)</label>
                    <Input
                      type="number"
                      value={selectedApi.timeout}
                      onChange={(e) => updateApiConfig(selectedApi.id, {
                        ...selectedApi,
                        timeout: parseInt(e.target.value)
                      })}
                      className="w-48"
                    />
                  </div>
                  <Button onClick={() => updateApiConfig(selectedApi.id, selectedApi)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIAdminDashboard;
