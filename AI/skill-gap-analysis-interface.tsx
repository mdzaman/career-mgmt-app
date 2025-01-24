import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';

const SkillGapAnalysis = () => {
  const [formData, setFormData] = useState({
    current_skills: [],
    target_job: '',
    experience_level: 'entry'
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSkillAdd = (skill) => {
    setFormData(prev => ({
      ...prev,
      current_skills: [...prev.current_skills, skill.trim()]
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'current-user', // Replace with actual user ID
          ...formData
        })
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Job</label>
              <Input
                value={formData.target_job}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  target_job: e.target.value
                }))}
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <Select
                value={formData.experience_level}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  experience_level: e.target.value
                }))}
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Skills</label>
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
                {formData.current_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Analyze Skills'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Skill Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={Object.entries(analysis.skill_scores).map(([skill, score]) => ({
                    skill,
                    score
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Missing Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.missing_skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{skill}</span>
                    <span className="text-sm text-gray-600">
                      Demand: {(analysis.market_demand[skill] * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Path</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    {rec.resource_url && (
                      <a 
                        href={rec.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalysis;
