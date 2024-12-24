# Database Schema Design for Career Platform Microservices

## 1. User Management Service (PostgreSQL)

### Users Table
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    account_type VARCHAR(50),
    profile_completion_percentage INT DEFAULT 0
);

CREATE TABLE user_profiles (
    profile_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    headline VARCHAR(200),
    summary TEXT,
    current_position VARCHAR(100),
    years_of_experience INT,
    location VARCHAR(100),
    timezone VARCHAR(50),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    preferred_work_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    preference_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    newsletter_subscription BOOLEAN DEFAULT true,
    language_preference VARCHAR(10) DEFAULT 'en',
    theme_preference VARCHAR(20) DEFAULT 'light'
);
```

## 2. Skills Assessment Service (MongoDB)

### Skills Collection
```javascript
{
  "_id": ObjectId(),
  "name": "JavaScript",
  "category": "Programming Language",
  "subcategory": "Frontend Development",
  "description": "High-level programming language",
  "level_descriptors": {
    "beginner": "Basic syntax understanding",
    "intermediate": "Async programming, DOM manipulation",
    "advanced": "Framework architecture, Performance optimization"
  },
  "related_skills": ["TypeScript", "React", "Node.js"],
  "created_at": ISODate(),
  "updated_at": ISODate()
}
```

### User Skills Collection
```javascript
{
  "_id": ObjectId(),
  "user_id": "uuid",
  "skills": [
    {
      "skill_id": ObjectId(),
      "level": "intermediate",
      "self_assessment_score": 7,
      "verified_score": 6.8,
      "last_assessed": ISODate(),
      "endorsements_count": 12,
      "certificates": [
        {
          "name": "JavaScript Advanced",
          "issuer": "Coursera",
          "issued_date": ISODate(),
          "verification_url": "https://..."
        }
      ]
    }
  ],
  "assessment_history": [
    {
      "date": ISODate(),
      "skill_id": ObjectId(),
      "score": 75,
      "type": "technical_assessment"
    }
  ]
}
```

## 3. Career Path Service (PostgreSQL)

### Career Paths Table
```sql
CREATE TABLE career_paths (
    path_id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    required_years_experience INT,
    difficulty_level VARCHAR(50),
    average_completion_time INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE career_milestones (
    milestone_id UUID PRIMARY KEY,
    path_id UUID REFERENCES career_paths(path_id),
    title VARCHAR(200),
    description TEXT,
    order_sequence INT,
    estimated_duration INT,
    required_skills JSON,
    optional_skills JSON
);

CREATE TABLE user_career_progress (
    progress_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    path_id UUID REFERENCES career_paths(path_id),
    current_milestone_id UUID REFERENCES career_milestones(milestone_id),
    start_date TIMESTAMP WITH TIME ZONE,
    estimated_completion_date TIMESTAMP WITH TIME ZONE,
    completion_percentage INT DEFAULT 0,
    status VARCHAR(50),
    notes TEXT
);
```

## 4. Learning Management Service (PostgreSQL + MongoDB)

### Courses Table (PostgreSQL)
```sql
CREATE TABLE courses (
    course_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(100),
    difficulty_level VARCHAR(50),
    duration_hours INT,
    price DECIMAL(10,2),
    rating DECIMAL(3,2),
    total_enrollments INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_courses (
    enrollment_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    course_id UUID REFERENCES courses(course_id),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INT DEFAULT 0,
    status VARCHAR(50),
    certificate_url VARCHAR(255)
);
```

### Course Content Collection (MongoDB)
```javascript
{
  "_id": ObjectId(),
  "course_id": "uuid",
  "modules": [
    {
      "module_id": ObjectId(),
      "title": "Introduction to JavaScript",
      "order": 1,
      "content": [
        {
          "type": "video",
          "title": "JavaScript Basics",
          "duration_minutes": 45,
          "url": "https://...",
          "transcript": "..."
        },
        {
          "type": "quiz",
          "questions": [
            {
              "question": "What is a closure?",
              "options": ["...", "...", "...", "..."],
              "correct_answer": 2
            }
          ]
        }
      ]
    }
  ]
}
```

## 5. Job Market Intelligence Service (MongoDB)

### Job Market Trends Collection
```javascript
{
  "_id": ObjectId(),
  "skill_id": ObjectId(),
  "timestamp": ISODate(),
  "region": "North America",
  "metrics": {
    "demand_score": 8.5,
    "growth_rate": 15.2,
    "avg_salary": {
      "entry_level": 75000,
      "mid_level": 95000,
      "senior_level": 130000
    },
    "job_postings_count": 5234,
    "companies_hiring": ["Google", "Amazon", "Microsoft"]
  },
  "historical_data": [
    {
      "date": ISODate(),
      "demand_score": 8.2,
      "job_postings_count": 4500
    }
  ]
}
```

## 6. Networking Service (Neo4j)

### Node Types
```cypher
// User Node
CREATE (u:User {
    user_id: "uuid",
    name: "John Doe",
    title: "Senior Developer",
    company: "Tech Corp",
    expertise: ["JavaScript", "Python"]
})

// Mentor Node
CREATE (m:Mentor {
    user_id: "uuid",
    specializations: ["Career Transition", "Technical Leadership"],
    availability: "10hrs/month",
    rating: 4.8
})

// Event Node
CREATE (e:Event {
    event_id: "uuid",
    title: "Tech Leadership Summit",
    date: datetime(),
    type: "webinar",
    max_participants: 100
})
```

### Relationships
```cypher
// Mentorship Relationship
CREATE (u:User)-[r:MENTORED_BY {
    start_date: datetime(),
    status: "active",
    session_count: 5
}]->(m:Mentor)

// Event Participation
CREATE (u:User)-[r:REGISTERED_FOR {
    registration_date: datetime(),
    status: "confirmed"
}]->(e:Event)
```

## 7. Content Management Service (MongoDB)

### Content Collection
```javascript
{
  "_id": ObjectId(),
  "type": "article",
  "title": "Career Growth in Tech",
  "author": {
    "user_id": "uuid",
    "name": "Jane Smith",
    "expertise": ["Career Coaching", "Technology"]
  },
  "content": {
    "body": "...",
    "summary": "...",
    "reading_time": 8
  },
  "metadata": {
    "tags": ["career growth", "technology", "skills development"],
    "categories": ["Career Advice", "Professional Development"],
    "language": "en",
    "region": "global"
  },
  "engagement": {
    "views": 1523,
    "likes": 89,
    "shares": 45,
    "comments": [
      {
        "user_id": "uuid",
        "comment": "Great insights!",
        "timestamp": ISODate()
      }
    ]
  },
  "status": "published",
  "created_at": ISODate(),
  "updated_at": ISODate(),
  "published_at": ISODate()
}
```

## 8. Analytics Service (ClickHouse)

### User Activity Table
```sql
CREATE TABLE user_activity (
    event_id UUID,
    user_id UUID,
    event_type String,
    event_category String,
    event_action String,
    event_value Float64,
    page_url String,
    referrer_url String,
    user_agent String,
    ip_address String,
    timestamp DateTime,
    session_id UUID
) ENGINE = MergeTree()
ORDER BY (timestamp, user_id);
```

### Performance Metrics Table
```sql
CREATE TABLE performance_metrics (
    metric_id UUID,
    service_name String,
    endpoint String,
    response_time_ms Int32,
    status_code Int16,
    error_message String,
    timestamp DateTime
) ENGINE = MergeTree()
ORDER BY (timestamp, service_name);
```

## Data Relationships and Foreign Keys

### Cross-Service References
- User Management Service → All other services via user_id
- Skills Assessment Service → Learning Management Service via skill_ids
- Career Path Service → Skills Assessment Service via required_skills
- Learning Management Service → Skills Assessment Service via course_skills

## Indexing Strategy

### PostgreSQL Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User profiles index
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Courses indexes
CREATE INDEX idx_courses_title ON courses(title);
CREATE INDEX idx_courses_provider ON courses(provider);
CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
```

### MongoDB Indexes
```javascript
// Skills collection
db.skills.createIndex({ "name": 1 });
db.skills.createIndex({ "category": 1 });

// User skills collection
db.user_skills.createIndex({ "user_id": 1 });
db.user_skills.createIndex({ "skills.skill_id": 1 });

// Content collection
db.content.createIndex({ "metadata.tags": 1 });
db.content.createIndex({ "created_at": -1 });
```

## Data Migration and Versioning

### Version Control
```sql
CREATE TABLE schema_versions (
    version_id SERIAL PRIMARY KEY,
    service_name VARCHAR(100),
    version VARCHAR(50),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
```

## Backup and Recovery

### Backup Strategy
1. PostgreSQL
   - Daily full backups
   - Continuous WAL archiving
   - Point-in-time recovery capability

2. MongoDB
   - Daily full backups
   - Oplog tailing for point-in-time recovery
   - Replica sets for high availability

3. Neo4j
   - Daily full backups
   - Transaction logs for point-in-time recovery
   - Causal cluster setup for high availability
