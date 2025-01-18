-- Personality Test Questions Table
CREATE TABLE personality_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(10) NOT NULL, -- 'MBTI', 'DISC'
    question_text TEXT NOT NULL,
    dimension VARCHAR(50), -- E.g., 'EI', 'SN', 'TF', 'JP' for MBTI
    question_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Answer Options Table
CREATE TABLE answer_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES personality_questions(id),
    option_text TEXT NOT NULL,
    option_value VARCHAR(10) NOT NULL, -- E.g., 'E', 'I', 'D', 'I', 'S', 'C'
    score_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personality Types Table
CREATE TABLE personality_types (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(10) NOT NULL,
    type_code VARCHAR(10) NOT NULL, -- E.g., 'INTJ', 'ESTP', 'High D'
    type_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Recommendations Table
CREATE TABLE career_recommendations (
    id SERIAL PRIMARY KEY,
    personality_type_id INT REFERENCES personality_types(id),
    career_title VARCHAR(100) NOT NULL,
    description TEXT,
    required_skills TEXT[],
    growth_potential TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Assessment Results Table
CREATE TABLE user_assessment_results (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    test_type VARCHAR(10) NOT NULL,
    result_type VARCHAR(10) NOT NULL,
    raw_scores JSONB,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Responses Table
CREATE TABLE user_responses (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    question_id INT REFERENCES personality_questions(id),
    selected_option_id INT REFERENCES answer_options(id),
    assessment_result_id INT REFERENCES user_assessment_results(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
