import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CareerPredictionDashboard = () => {
  const [profile, setProfile] = useState({
    skills: [],
    interests: [],
    education: [],
    experience: []
  });
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSkillAdd = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/career-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (err) {
      setError('Failed to fetch career predictions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Career Path Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Skills Input */}
            <div>
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSkillAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Predict Career Paths'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle>Predicted Career Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-medium">{prediction.title}</h3>
                  <p className="text-sm text-gray-600">
                    Confidence: {prediction.confidence}%
                  </p>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {prediction.required_skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerPredictionDashboard;
