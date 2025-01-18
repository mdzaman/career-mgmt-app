from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI()

# Pydantic models for request/response
class QuestionBase(BaseModel):
    test_type: str
    question_text: str
    dimension: str
    question_order: int

class AnswerOptionBase(BaseModel):
    option_text: str
    option_value: str
    score_value: int

class UserResponse(BaseModel):
    question_id: int
    selected_option_id: int

class AssessmentResult(BaseModel):
    user_id: str
    test_type: str
    result_type: str
    raw_scores: dict

# API Routes
@app.get("/api/questions/{test_type}")
async def get_questions(test_type: str, db: Session = Depends(get_db)):
    """Get all questions for a specific test type"""
    questions = db.query(Question).filter(Question.test_type == test_type)\
                 .order_by(Question.question_order).all()
    return questions

@app.post("/api/submit-responses")
async def submit_responses(responses: List[UserResponse], db: Session = Depends(get_db)):
    """Submit user responses and calculate results"""
    try:
        # Create assessment result
        result = calculate_personality_type(responses)
        
        # Store results
        assessment_result = UserAssessmentResult(
            user_id=responses[0].user_id,
            test_type=result.test_type,
            result_type=result.result_type,
            raw_scores=result.raw_scores
        )
        db.add(assessment_result)
        
        # Store individual responses
        for response in responses:
            user_response = UserResponse(
                user_id=response.user_id,
                question_id=response.question_id,
                selected_option_id=response.selected_option_id,
                assessment_result_id=assessment_result.id
            )
            db.add(user_response)
        
        db.commit()
        return assessment_result
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def calculate_personality_type(responses: List[UserResponse]) -> AssessmentResult:
    """Calculate personality type based on responses"""
    # MBTI Calculation
    if responses[0].test_type == "MBTI":
        scores = {
            "E": 0, "I": 0,
            "S": 0, "N": 0,
            "T": 0, "F": 0,
            "J": 0, "P": 0
        }
        
        for response in responses:
            option = get_option_by_id(response.selected_option_id)
            scores[option.option_value] += option.score_value
        
        # Determine type
        personality_type = ""
        personality_type += "E" if scores["E"] > scores["I"] else "I"
        personality_type += "S" if scores["S"] > scores["N"] else "N"
        personality_type += "T" if scores["T"] > scores["F"] else "F"
        personality_type += "J" if scores["J"] > scores["P"] else "P"
        
        return AssessmentResult(
            test_type="MBTI",
            result_type=personality_type,
            raw_scores=scores
        )
    
    # DISC Calculation
    elif responses[0].test_type == "DISC":
        scores = {"D": 0, "I": 0, "S": 0, "C": 0}
        
        for response in responses:
            option = get_option_by_id(response.selected_option_id)
            scores[option.option_value] += option.score_value
        
        # Determine primary DISC type
        primary_type = max(scores, key=scores.get)
        
        return AssessmentResult(
            test_type="DISC",
            result_type=primary_type,
            raw_scores=scores
        )

@app.get("/api/results/{user_id}")
async def get_results(user_id: str, db: Session = Depends(get_db)):
    """Get assessment results for a user"""
    results = db.query(UserAssessmentResult)\
               .filter(UserAssessmentResult.user_id == user_id)\
               .order_by(UserAssessmentResult.completed_at.desc())\
               .all()
    return results

@app.get("/api/career-recommendations/{personality_type}")
async def get_career_recommendations(personality_type: str, db: Session = Depends(get_db)):
    """Get career recommendations for a personality type"""
    recommendations = db.query(CareerRecommendation)\
                       .join(PersonalityType)\
                       .filter(PersonalityType.type_code == personality_type)\
                       .all()
    return recommendations
