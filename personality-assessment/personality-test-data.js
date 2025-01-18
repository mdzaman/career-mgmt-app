export const mbtiQuestions = [
  // E vs I (Extraversion vs Introversion)
  {
    question: "In social situations, you tend to:",
    options: [
      { text: "Seek out interactions and feel energized by people", value: "E" },
      { text: "Prefer smaller groups and need time alone to recharge", value: "I" }
    ],
    dimension: "EI"
  },
  {
    question: "When working on projects, you prefer to:",
    options: [
      { text: "Discuss ideas with others and think out loud", value: "E" },
      { text: "Process information internally before sharing", value: "I" }
    ],
    dimension: "EI"
  },
  {
    question: "At parties, you usually:",
    options: [
      { text: "Stay late, getting more energetic as time goes on", value: "E" },
      { text: "Leave early, feeling drained from social interaction", value: "I" }
    ],
    dimension: "EI"
  },
  
  // S vs N (Sensing vs Intuition)
  {
    question: "When learning new information, you focus more on:",
    options: [
      { text: "Concrete facts and specific details", value: "S" },
      { text: "Patterns and possible interpretations", value: "N" }
    ],
    dimension: "SN"
  },
  {
    question: "You are more interested in:",
    options: [
      { text: "What is actual and present", value: "S" },
      { text: "What is possible and future-oriented", value: "N" }
    ],
    dimension: "SN"
  },
  {
    question: "When solving problems, you prefer to:",
    options: [
      { text: "Use tried-and-true methods", value: "S" },
      { text: "Try new, innovative approaches", value: "N" }
    ],
    dimension: "SN"
  },
  
  // T vs F (Thinking vs Feeling)
  {
    question: "When making decisions, you primarily consider:",
    options: [
      { text: "Logic and objective analysis", value: "T" },
      { text: "People and personal values", value: "F" }
    ],
    dimension: "TF"
  },
  {
    question: "In conflicts, you tend to:",
    options: [
      { text: "Focus on finding the most logical solution", value: "T" },
      { text: "Consider how solutions affect everyone involved", value: "F" }
    ],
    dimension: "TF"
  },
  {
    question: "You are more convinced by:",
    options: [
      { text: "Well-reasoned arguments", value: "T" },
      { text: "Strong emotional appeals", value: "F" }
    ],
    dimension: "TF"
  },
  
  // J vs P (Judging vs Perceiving)
  {
    question: "In your daily life, you prefer to:",
    options: [
      { text: "Have a clear schedule and stick to it", value: "J" },
      { text: "Be flexible and adapt as things come up", value: "P" }
    ],
    dimension: "JP"
  },
  {
    question: "You feel more comfortable when:",
    options: [
      { text: "Things are decided and settled", value: "J" },
      { text: "Options are left open", value: "P" }
    ],
    dimension: "JP"
  },
  {
    question: "When starting a project, you typically:",
    options: [
      { text: "Plan everything out before beginning", value: "J" },
      { text: "Jump in and figure it out as you go", value: "P" }
    ],
    dimension: "JP"
  }
];

export const discQuestions = [
  {
    question: "When facing challenges, you tend to:",
    options: [
      { text: "Take charge and push forward directly", value: "D" },
      { text: "Influence others to join and help", value: "I" },
      { text: "Work steadily and support the team", value: "S" },
      { text: "Analyze the situation carefully", value: "C" }
    ]
  },
  {
    question: "In team projects, you usually:",
    options: [
      { text: "Lead and make key decisions", value: "D" },
      { text: "Generate enthusiasm and ideas", value: "I" },
      { text: "Maintain harmony and cooperation", value: "S" },
      { text: "Ensure accuracy and quality", value: "C" }
    ]
  },
  {
    question: "Under pressure, you are likely to:",
    options: [
      { text: "Be forceful and demanding", value: "D" },
      { text: "Be optimistic and talkative", value: "I" },
      { text: "Be patient and supportive", value: "S" },
      { text: "Be thorough and analytical", value: "C" }
    ]
  },
  {
    question: "Your preferred work environment is:",
    options: [
      { text: "Results-oriented and challenging", value: "D" },
      { text: "Social and collaborative", value: "I" },
      { text: "Stable and harmonious", value: "S" },
      { text: "Structured and detailed", value: "C" }
    ]
  },
  {
    question: "When solving problems, you focus on:",
    options: [
      { text: "Finding quick, decisive solutions", value: "D" },
      { text: "Creating innovative, exciting ideas", value: "I" },
      { text: "Maintaining stability and agreement", value: "S" },
      { text: "Establishing precise, systematic approaches", value: "C" }
    ]
  }
];

export const personalityTypes = {
  // MBTI Types
  ISTJ: {
    name: "The Inspector",
    description: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
    strengths: ["Organized", "Honest and Direct", "Strong-willed", "Very Responsible"],
    careers: ["Accountant", "Financial Analyst", "Project Manager", "Military Officer", "Judge"]
  },
  ISFJ: {
    name: "The Protector",
    description: "Very dedicated and warm protectors, always ready to defend their loved ones.",
    strengths: ["Supportive", "Reliable", "Patient", "Good Practical Skills"],
    careers: ["Nurse", "Teacher", "Social Worker", "Counselor", "Administrator"]
  },
  INFJ: {
    name: "The Advocate",
    description: "Quiet and mystical, yet very inspiring and tireless idealists.",
    strengths: ["Creative", "Insightful", "Principled", "Passionate"],
    careers: ["Counselor", "HR Developer", "Writer", "Therapist", "Non-profit Director"]
  },
  INTJ: {
    name: "The Architect",
    description: "Imaginative and strategic thinkers, with a plan for everything.",
    strengths: ["Strategic", "Independent", "Innovative", "Analytical"],
    careers: ["Software Architect", "Investment Banker", "Scientific Researcher", "Business Strategist", "Systems Engineer"]
  },
  ISTP: {
    name: "The Virtuoso",
    description: "Bold and practical experimenters, masters of all kinds of tools.",
    strengths: ["Optimistic", "Creative", "Practical", "Learning by Experience"],
    careers: ["Engineer", "Mechanic", "Pilot", "Data Analyst", "Emergency Response"]
  },
  ISFP: {
    name: "The Adventurer",
    description: "Flexible and charming artists, always ready to explore and experience something new.",
    strengths: ["Artistic", "Sensitive", "Passionate", "Imaginative"],
    careers: ["Artist", "Designer", "Photographer", "Physical Therapist", "Fashion Designer"]
  },
  INFP: {
    name: "The Mediator",
    description: "Poetic, kind and altruistic people, always eager to help a good cause.",
    strengths: ["Empathetic", "Creative", "Passionate", "Open-minded"],
    careers: ["Writer", "Counselor", "UX Designer", "Environmental Scientist", "Social Worker"]
  },
  INTP: {
    name: "The Logician",
    description: "Innovative inventors with an unquenchable thirst for knowledge.",
    strengths: ["Analytical", "Original", "Open-minded", "Objective"],
    careers: ["Software Developer", "Research Scientist", "Professor", "Data Analyst", "Architect"]
  },
  ESTP: {
    name: "The Entrepreneur",
    description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
    strengths: ["Perceptive", "Sociable", "Energetic", "Adaptable"],
    careers: ["Entrepreneur", "Sales Manager", "Marketing Director", "Detective", "Sports Coach"]
  },
  ESFP: {
    name: "The Entertainer",
    description: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
    strengths: ["Sociable", "Practical", "Observant", "Excellent People Skills"],
    careers: ["Event Planner", "Sales Representative", "Tour Guide", "Performer", "Restaurant Manager"]
  },
  ENFP: {
    name: "The Campaigner",
    description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
    strengths: ["Enthusiastic", "Creative", "Sociable", "Dynamic"],
    careers: ["Marketing Manager", "Public Relations", "Journalist", "Creative Director", "Life Coach"]
  },
  ENTP: {
    name: "The Debater",
    description: "Smart and curious thinkers who cannot resist an intellectual challenge.",
    strengths: ["Innovative", "Analytical", "Enthusiastic", "Adaptable"],
    careers: ["Entrepreneur", "Management Consultant", "Attorney", "Software Developer", "Creative Director"]
  },
  ESTJ: {
    name: "The Executive",
    description: "Excellent administrators, unsurpassed at managing things – or people.",
    strengths: ["Organized", "Leadership", "Dedicated", "Traditional"],
    careers: ["Business Manager", "School Administrator", "Project Manager", "Police Officer", "Financial Officer"]
  },
  ESFJ: {
    name: "The Consul",
    description: "Extraordinarily caring, social and popular people, always eager to help.",
    strengths: ["Practical", "Loyal", "Sensitive", "Excellent People Skills"],
    careers: ["Healthcare Administrator", "Sales Manager", "HR Manager", "Teacher", "Social Worker"]
  },
  ENFJ: {
    name: "The Protagonist",
    description: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
    strengths: ["Charismatic", "Empathetic", "Natural Leader", "Reliable"],
    careers: ["Training Manager", "Non-profit Director", "HR Director", "Teacher", "Marketing Manager"]
  },
  ENTJ: {
    name: "The Commander",
    description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one.",
    strengths: ["Strategic", "Charismatic", "Efficient", "Strong-willed"],
    careers: ["Corporate Executive", "Management Consultant", "Lawyer", "Entrepreneur", "Business Director"]
  },
  
  // DISC Types
  D: {
    name: "Dominance",
    description: "Direct, decisive, problem-solver, risk-taker.",
    strengths: ["Leadership", "Decisive Action", "Innovation", "Results-Oriented"],
    careers: ["Executive", "Entrepreneur", "Sales Director", "Military Officer", "Business Owner"]
  },
  I: {
    name: "Influence",
    description: "Optimistic, social, persuasive, talkative.",
    strengths: ["Communication", "Networking", "Enthusiasm", "Creativity"],
    careers: ["Public Relations", "Sales", "Marketing", "Entertainment", "Teaching"]
  },
  S: {
    name: "Steadiness",
    description: "Patient, loyal, stable, predictable.",
    strengths: ["Reliability", "Team Player", "Patient", "Good Listener"],
    careers: ["HR Professional", "Counselor", "Nurse", "Customer Service", "Administrator"]
  },
  C: {
    name: "Conscientiousness",
    description: "Accurate, analytical, conscientious, careful.",
    strengths: ["Attention to Detail", "Analysis", "Systems and Processes", "Quality Control"],
    careers: ["Accountant", "Engineer", "Researcher", "IT Specialist", "Quality Analyst"]
  }
};
