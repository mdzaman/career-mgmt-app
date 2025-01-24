from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import boto3
import json
from datetime import datetime

app = FastAPI(title="Skill Gap Analysis Service")

# Models
class SkillGapRequest(BaseModel):
    user_id: str
    current_skills: List[str]
    target_job: str
    experience_level: str

class SkillGapResponse(BaseModel):
    missing_skills: List[str]
    skill_scores: Dict[str, float]
    recommendations: List[Dict[str, str]]
    market_demand: Dict[str, float]

# AWS Services
comprehend = boto3.client('comprehend')
dynamodb = boto3.resource('dynamodb')
sagemaker = boto3.client('sagemaker-runtime')

skill_table = dynamodb.Table('skill_requirements')
analysis_table = dynamodb.Table('skill_gap_analysis')

async def analyze_skills(request: SkillGapRequest) -> SkillGapResponse:
    try:
        # Get job requirements
        job_skills = await get_job_requirements(request.target_job)
        
        # Compare skills
        missing = [skill for skill in job_skills if skill not in request.current_skills]
        
        # Get market demand data
        demand = await get_market_demand(missing)
        
        # Generate recommendations
        recommendations = await generate_learning_path(missing, request.experience_level)
        
        # Calculate skill scores
        scores = {
            skill: await calculate_skill_score(skill, request.current_skills)
            for skill in job_skills
        }
        
        response = SkillGapResponse(
            missing_skills=missing,
            skill_scores=scores,
            recommendations=recommendations,
            market_demand=demand
        )
        
        # Store analysis
        store_analysis(request.user_id, response)
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_job_requirements(job_title: str) -> List[str]:
    response = skill_table.get_item(
        Key={'job_title': job_title}
    )
    return response.get('Item', {}).get('required_skills', [])

async def get_market_demand(skills: List[str]) -> Dict[str, float]:
    # Call SageMaker endpoint for demand prediction
    response = sagemaker.invoke_endpoint(
        EndpointName='skill-demand-endpoint',
        ContentType='application/json',
        Body=json.dumps({'skills': skills})
    )
    return json.loads(response['Body'].read())

async def generate_learning_path(skills: List[str], level: str) -> List[Dict[str, str]]:
    # Generate personalized learning recommendations
    payload = {
        'missing_skills': skills,
        'experience_level': level
    }
    response = sagemaker.invoke_endpoint(
        EndpointName='learning-path-endpoint',
        ContentType='application/json',
        Body=json.dumps(payload)
    )
    return json.loads(response['Body'].read())

async def calculate_skill_score(skill: str, current_skills: List[str]) -> float:
    # Calculate relevance score using Comprehend
    response = comprehend.detect_key_phrases(
        Text=skill,
        LanguageCode='en'
    )
    # Implement scoring logic
    return 0.8  # Placeholder

def store_analysis(user_id: str, analysis: SkillGapResponse):
    analysis_table.put_item(Item={
        'user_id': user_id,
        'timestamp': datetime.utcnow().isoformat(),
        'analysis': analysis.dict()
    })

# API Routes
@app.post("/api/v1/skill-gap", response_model=SkillGapResponse)
async def analyze_skill_gap(request: SkillGapRequest):
    return await analyze_skills(request)

@app.get("/api/v1/skill-gap/{user_id}")
async def get_user_analysis(user_id: str):
    response = analysis_table.query(
        KeyConditionExpression='user_id = :uid',
        ExpressionAttributeValues={':uid': user_id},
        ScanIndexForward=False,
        Limit=1
    )
    if not response['Items']:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return response['Items'][0]

# Admin routes
@app.get("/admin/skills/trending")
async def get_trending_skills():
    # Implement trending skills analysis
    pass
