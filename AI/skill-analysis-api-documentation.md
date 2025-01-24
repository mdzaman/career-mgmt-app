# Skill Analysis System API Documentation

## Base URL
```
https://api.skillanalysis.com/v1
```

## Authentication
All API requests require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting
- 100 requests per minute per API key
- 1000 requests per hour per API key

## Endpoints

### Skill Gap Analysis

#### Analyze Skill Gap
```http
POST /skill-gap
```

Analyzes the gap between user's current skills and target job requirements.

**Request Body:**
```json
{
  "user_id": "string",
  "current_skills": ["string"],
  "target_job": "string",
  "experience_level": "entry" | "mid" | "senior"
}
```

**Response:**
```json
{
  "missing_skills": ["string"],
  "skill_scores": {
    "skill_name": float
  },
  "recommendations": [
    {
      "title": "string",
      "description": "string",
      "resource_url": "string"
    }
  ],
  "market_demand": {
    "skill_name": float
  }
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 429: Rate limit exceeded
- 500: Server error

#### Get User Analysis History
```http
GET /skill-gap/{user_id}
```

Returns historical skill gap analyses for a user.

**Response:**
```json
[
  {
    "timestamp": "string",
    "analysis": {
      // Same as POST /skill-gap response
    }
  }
]
```

### Skill Demand Prediction

#### Get Skill Demand
```http
GET /skill-demand
```

Returns demand predictions for specified skills.

**Query Parameters:**
- skills: Comma-separated list of skills
- region: Geographic region (optional)
- timeframe: Prediction timeframe in months (default: 12)

**Response:**
```json
{
  "predictions": [
    {
      "skill": "string",
      "demand_score": float,
      "growth_rate": float,
      "confidence": float
    }
  ]
}
```

### Skill Trends Analysis

#### Get Trending Skills
```http
GET /trends
```

Returns current skill trends and analysis.

**Query Parameters:**
- industry: Filter by industry (optional)
- timeframe: Analysis period in days (default: 30)

**Response:**
```json
{
  "top_skills": [
    {
      "skill": "string",
      "count": integer
    }
  ],
  "growing_skills": [
    {
      "skill": "string",
      "growth_rate": float
    }
  ],
  "salary_impact": [
    {
      "skill": "string",
      "median_salary": float,
      "sample_size": integer
    }
  ],
  "industry_demand": [
    {
      "industry": "string",
      "skill": "string",
      "relative_demand": float
    }
  ]
}
```

### Admin APIs

#### Get Model Metrics
```http
GET /admin/model/metrics
```

Returns model performance metrics.

**Response:**
```json
{
  "accuracy": [
    {
      "timestamp": "string",
      "value": float
    }
  ],
  "latency": [
    {
      "timestamp": "string",
      "value": float
    }
  ],
  "predictions": [
    {
      "timestamp": "string",
      "value": float
    }
  ],
  "drift": [
    {
      "timestamp": "string",
      "value": float
    }
  ]
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": object
  }
}
```

Common error codes:
- INVALID_REQUEST: Request validation failed
- UNAUTHORIZED: Authentication required
- RATE_LIMITED: Rate limit exceeded
- MODEL_ERROR: ML model error
- INTERNAL_ERROR: Server error

## Webhooks

### Skill Update Notification
```http
POST {webhook_url}
```

Notified when significant skill trends change.

**Payload:**
```json
{
  "event_type": "skill_trend_update",
  "timestamp": "string",
  "changes": [
    {
      "skill": "string",
      "trend_type": "growing" | "declining",
      "magnitude": float
    }
  ]
}
```

## SDK Examples

### Python
```python
from skill_analysis import SkillAnalysisClient

client = SkillAnalysisClient('your_api_key')

# Analyze skill gap
analysis = client.analyze_skill_gap(
    user_id='user123',
    current_skills=['python', 'javascript'],
    target_job='Full Stack Developer',
    experience_level='mid'
)

# Get skill demand
demand = client.get_skill_demand(
    skills=['react', 'node.js'],
    region='US',
    timeframe=6
)
```

### JavaScript
```javascript
import { SkillAnalysisClient } from '@skill-analysis/client';

const client = new SkillAnalysisClient('your_api_key');

// Analyze skill gap
const analysis = await client.analyzeSkillGap({
  userId: 'user123',
  currentSkills: ['python', 'javascript'],
  targetJob: 'Full Stack Developer',
  experienceLevel: 'mid'
});

// Get skill demand
const demand = await client.getSkillDemand({
  skills: ['react', 'node.js'],
  region: 'US',
  timeframe: 6
});
```

## Best Practices

1. Implement exponential backoff for retries
2. Cache frequently accessed data
3. Use webhook notifications for real-time updates
4. Monitor rate limits using response headers
5. Implement request batching for bulk operations

## API Versioning

The API uses semantic versioning (MAJOR.MINOR). Breaking changes increment the MAJOR version.

To specify a version:
1. Use the Accept header:
   ```
   Accept: application/vnd.skillanalysis.v1+json
   ```
2. Or use the version prefix in the URL:
   ```
   https://api.skillanalysis.com/v1/
   ```

## Support

- Documentation: https://docs.skillanalysis.com
- Support Email: api-support@skillanalysis.com
- Status Page: https://status.skillanalysis.com