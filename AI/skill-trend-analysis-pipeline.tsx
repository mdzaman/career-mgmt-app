
import boto3
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict
import json

class SkillTrendsAnalysis:
    def __init__(self):
        self.athena = boto3.client('athena')
        self.s3 = boto3.client('s3')
        self.comprehend = boto3.client('comprehend')
        
    def analyze_trends(self, days: int = 30) -> Dict:
        """Analyze skill trends over specified time period"""
        job_data = self.fetch_job_data(days)
        skills = self.extract_skills(job_data)
        trends = self.calculate_trends(skills)
        self.store_results(trends)
        return trends
        
    def fetch_job_data(self, days: int) -> pd.DataFrame:
        """Fetch job posting data from data warehouse"""
        query = f"""
        SELECT job_title, description, requirements, posted_date, salary_range
        FROM job_postings
        WHERE posted_date >= DATE_SUB(CURRENT_DATE, {days})
        """
        
        execution = self.athena.start_query_execution(
            QueryString=query,
            ResultConfiguration={
                'OutputLocation': 's3://skill-analysis-results/'
            }
        )
        
        # Wait for query completion and get results
        results = self.get_query_results(execution['QueryExecutionId'])
        return pd.DataFrame(results)
        
    def extract_skills(self, job_data: pd.DataFrame) -> List[Dict]:
        """Extract skills from job descriptions using Amazon Comprehend"""
        skills = []
        
        for _, row in job_data.iterrows():
            text = f"{row['description']} {row['requirements']}"
            
            # Detect key phrases
            response = self.comprehend.detect_key_phrases(
                Text=text,
                LanguageCode='en'
            )
            
            # Filter and classify skills
            for phrase in response['KeyPhrases']:
                if self.is_skill(phrase['Text']):
                    skills.append({
                        'skill': phrase['Text'],
                        'job_title': row['job_title'],
                        'date': row['posted_date'],
                        'salary_range': row['salary_range']
                    })
        
        return skills
        
    def is_skill(self, phrase: str) -> bool:
        """Determine if a phrase represents a skill"""
        # Implement skill classification logic
        # Could use ML model or rule-based system
        return True
        
    def calculate_trends(self, skills: List[Dict]) -> Dict:
        """Calculate skill trends and metrics"""
        df = pd.DataFrame(skills)
        
        trends = {
            'top_skills': self.get_top_skills(df),
            'growing_skills': self.get_growing_skills(df),
            'salary_impact': self.get_salary_impact(df),
            'industry_demand': self.get_industry_demand(df)
        }
        
        return trends
        
    def get_top_skills(self, df: pd.DataFrame) -> List[Dict]:
        """Get most frequently mentioned skills"""
        counts = df['skill'].value_counts()
        return [
            {'skill': skill, 'count': count}
            for skill, count in counts.items()
        ][:20]
        
    def get_growing_skills(self, df: pd.DataFrame) -> List[Dict]:
        """Identify skills with growing demand"""
        df['week'] = pd.to_datetime(df['date']).dt.isocalendar().week
        
        # Calculate week-over-week growth
        weekly_counts = df.pivot_table(
            index='skill',
            columns='week',
            values='job_title',
            aggfunc='count'
        ).fillna(0)
        
        growth_rates = (
            (weekly_counts.iloc[:, -1] - weekly_counts.iloc[:, 0]) 
            / weekly_counts.iloc[:, 0]
        )
        
        return [
            {'skill': skill, 'growth_rate': rate}
            for skill, rate in growth_rates.items()
            if rate > 0.1  # 10% growth threshold
        ]
        
    def get_salary_impact(self, df: pd.DataFrame) -> List[Dict]:
        """Analyze salary impact of different skills"""
        # Extract median salary for each skill
        df['median_salary'] = df['salary_range'].apply(self.extract_median_salary)
        
        salary_impact = df.groupby('skill')['median_salary'].agg(['median', 'count'])
        salary_impact = salary_impact[salary_impact['count'] >= 10]  # Min sample size
        
        return [
            {
                'skill': skill,
                'median_salary': metrics['median'],
                'sample_size': metrics['count']
            }
            for skill, metrics in salary_impact.items()
        ]
        
    def get_industry_demand(self, df: pd.DataFrame) -> List[Dict]:
        """Analyze skill demand by industry"""
        # Group by industry and skill
        industry_demand = df.groupby(['industry', 'skill']).size().reset_index(name='count')
        
        # Calculate relative demand within each industry
        industry_demand['relative_demand'] = industry_demand.groupby('industry')['count'].transform(
            lambda x: x / x.sum()
        )
        
        return industry_demand.to_dict('records')
    
    def store_results(self, trends: Dict):
        """Store trend analysis results"""
        timestamp = datetime.now().strftime('%Y-%m-%d-%H')
        key = f'trends/daily/{timestamp}.json'
        
        self.s3.put_object(
            Bucket='skill-analysis-results',
            Key=key,
            Body=json.dumps(trends)
        )
        
        # Update latest trends
        self.s3.put_object(
            Bucket='skill-analysis-results',
            Key='trends/latest.json',
            Body=json.dumps(trends)
        )
    
    def get_query_results(self, query_id: str) -> List[Dict]:
        """Get results of Athena query"""
        while True:
            status = self.athena.get_query_execution(QueryExecutionId=query_id)
            state = status['QueryExecution']['Status']['State']
            
            if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
                break
                
            time.sleep(5)
            
        if state == 'SUCCEEDED':
            results = self.athena.get_query_results(QueryExecutionId=query_id)
            return self.parse_query_results(results)
        else:
            raise Exception(f"Query failed with state: {state}")
    
    def parse_query_results(self, results: Dict) -> List[Dict]:
        """Parse Athena query results"""
        headers = [col['Name'] for col in results['ResultSet']['ResultSetMetadata']['ColumnInfo']]
        rows = []
        
        for row in results['ResultSet']['Rows'][1:]:  # Skip header
            values = [field.get('VarCharValue', '') for field in row['Data']]
            rows.append(dict(zip(headers, values)))
            
        return rows
    
    def extract_median_salary(self, salary_range: str) -> float:
        """Extract median salary from range"""
        try:
            if '-' in salary_range:
                low, high = map(
                    lambda x: float(x.replace(', '').replace('K', '000').replace(',', '')),
                    salary_range.split('-')
                )
                return (low + high) / 2
            return float(salary_range.replace(', '').replace('K', '000').replace(',', ''))
        except:
            return None

def main():
    analyzer = SkillTrendsAnalysis()
    trends = analyzer.analyze_trends(days=30)
    print(f"Analysis complete. Found {len(trends['top_skills'])} top skills.")

if __name__ == '__main__':
    main()
