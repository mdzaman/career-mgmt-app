import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PersonalityAssessment = () => {
  const [currentTest, setCurrentTest] = useState('mbti');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    mbti: [],
    disc: [],
    ocean: [],
    high5: []
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Sample MBTI questions (we'll keep it short for demo)
  const mbtiQuestions = [
    {
      question: "At social events, you:",
      options: [
        { text: "Interact with many, including strangers", value: "E" },
        { text: "Interact with a few people you know", value: "I" }
      ]
    },
    {
      question: "You tend to focus on:",
      options: [
        { text: "Concrete facts and details", value: "S" },
        { text: "Patterns and possibilities", value: "N" }
      ]
    },
    {
      question: "In making decisions, you look at:",
      options: [
        { text: "Logic and consistency", value: "T" },
        { text: "People and circumstances", value: "F" }
      ]
    },
    {
      question: "In planning your day, you prefer to:",
      options: [
        { text: "Have a structured schedule", value: "J" },
        { text: "Be flexible and spontaneous", value: "P" }
      ]
    }
  ];

  // DISC questions
  const discQuestions = [
    {
      question: "In a group project, you typically:",
      options: [
        { text: "Take charge and direct others", value: "D" },
        { text: "Focus on supporting team members", value: "S" },
        { text: "Ensure everyone's voice is heard", value: "I" },
        { text: "Analyze all details carefully", value: "C" }
      ]
    }
  ];

  // Career recommendations based on personality type
  const careerRecommendations = {
    INTJ: [
      "Data Scientist",
      "Software Architect",
      "Strategic Planner",
      "Research Scientist",
      "Investment Banker"
    ],
    ENTJ: [
      "Business Executive",
      "Management Consultant",
      "Entrepreneur",
      "Corporate Strategist",
      "Technology Leader"
    ],
    // Add more types...
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentTest]: [...prev[currentTest], answer]
    }));

    if (currentQuestion < getQuestionsForTest(currentTest).length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentTest === 'mbti') {
      // Move to next test or show results
      calculateResults();
    }
  };

  const getQuestionsForTest = (test) => {
    switch(test) {
      case 'mbti':
        return mbtiQuestions;
      case 'disc':
        return discQuestions;
      default:
        return [];
    }
  };

  const calculateResults = () => {
    // Calculate MBTI type
    const mbtiAnswers = answers.mbti;
    let type = '';
    
    // E/I
    const eCount = mbtiAnswers.filter(a => a === 'E').length;
    type += eCount > mbtiAnswers.length / 2 ? 'E' : 'I';
    
    // S/N
    const sCount = mbtiAnswers.filter(a => a === 'S').length;
    type += sCount > mbtiAnswers.length / 2 ? 'S' : 'N';
    
    // T/F
    const tCount = mbtiAnswers.filter(a => a === 'T').length;
    type += tCount > mbtiAnswers.length / 2 ? 'T' : 'F';
    
    // J/P
    const jCount = mbtiAnswers.filter(a => a === 'J').length;
    type += jCount > mbtiAnswers.length / 2 ? 'J' : 'P';

    setResults({ type, careers: careerRecommendations[type] || [] });
    setShowResults(true);
  };

  const currentQuestions = getQuestionsForTest(currentTest);
  const progress = (currentQuestion / currentQuestions.length) * 100;

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Personality Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Your MBTI Type: {results.type}</h3>
              <p className="mt-2">Based on your responses, you align with the {results.type} personality type.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Recommended Career Paths</h3>
              <div className="mt-2 space-y-2">
                {results.careers.map((career, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    {career}
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Remember, these are suggestions based on your personality type. Consider them as starting points for your career exploration.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({ mbti: [], disc: [], ocean: [], high5: [] });
              }}
              className="w-full"
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personality Assessment</CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">
            {currentQuestions[currentQuestion].question}
          </div>
          
          <div className="space-y-3">
            {currentQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option.value)}
                variant="outline"
                className="w-full text-left justify-start h-auto py-4 px-6"
              >
                {option.text}
              </Button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={currentQuestion === currentQuestions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityAssessment;
