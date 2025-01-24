
import sagemaker
from sagemaker.huggingface import HuggingFace
from sagemaker.processing import ScriptProcessor
import boto3
import json

class SkillDemandTrainingPipeline:
    def __init__(self, role, bucket):
        self.role = role
        self.bucket = bucket
        self.sm_client = boto3.client('sagemaker')
        self.s3_client = boto3.client('s3')
        
    def preprocess_data(self):
        processor = ScriptProcessor(
            command=['python3'],
            image_uri='sklearn-preprocessing:1.0',
            role=self.role,
            instance_count=1,
            instance_type='ml.m5.xlarge'
        )
        
        processor.run(
            code='preprocess.py',
            inputs=[{
                'source': f's3://{self.bucket}/raw/job_postings/',
                'destination': '/opt/ml/processing/input'
            }],
            outputs=[{
                'source': '/opt/ml/processing/output',
                'destination': f's3://{self.bucket}/processed/training'
            }]
        )

    def train_model(self):
        huggingface_estimator = HuggingFace(
            entry_point='train.py',
            source_dir='code',
            instance_type='ml.g4dn.xlarge',
            instance_count=1,
            role=self.role,
            transformers_version='4.26',
            pytorch_version='1.13',
            py_version='py39',
            hyperparameters={
                'epochs': 3,
                'train-batch-size': 32,
                'eval-batch-size': 64
            }
        )
        
        huggingface_estimator.fit({
            'train': f's3://{self.bucket}/processed/training',
            'test': f's3://{self.bucket}/processed/test'
        })

    def deploy_model(self, training_job_name):
        model_data = f's3://{self.bucket}/models/{training_job_name}/output/model.tar.gz'
        
        predictor = huggingface_estimator.deploy(
            initial_instance_count=1,
            instance_type='ml.g4dn.xlarge',
            endpoint_name='skill-demand-endpoint'
        )
        
        return predictor.endpoint_name

class DataPreprocessing:
    def process_job_data(data_path):
        """Preprocess job posting data for training"""
        df = pd.read_parquet(data_path)
        
        # Extract skills from job descriptions
        df['skills'] = df['description'].apply(extract_skills)
        
        # Calculate demand scores
        df['demand_score'] = calculate_demand_score(df)
        
        return df

    def extract_skills(text):
        """Extract skills from text using NLP"""
        nlp = spacy.load('en_core_web_sm')
        doc = nlp(text)
        
        skills = []
        for ent in doc.ents:
            if ent.label_ == 'SKILL':
                skills.append(ent.text)
                
        return skills

    def calculate_demand_score(df):
        """Calculate demand score based on multiple factors"""
        weights = {
            'posting_frequency': 0.4,
            'salary_level': 0.3,
            'company_tier': 0.3
        }
        
        score = (
            df['posting_frequency'] * weights['posting_frequency'] +
            df['salary_normalized'] * weights['salary_level'] +
            df['company_score'] * weights['company_tier']
        )
        
        return score

class ModelTraining:
    def build_model():
        """Create and compile the model"""
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model

    def train(model, train_data, validation_data, epochs=10):
        """Train the model"""
        history = model.fit(
            train_data,
            validation_data=validation_data,
            epochs=epochs,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(patience=3),
                tf.keras.callbacks.ModelCheckpoint(
                    'best_model.h5',
                    save_best_only=True
                )
            ]
        )
        
        return history

def main():
    role = 'arn:aws:iam::ACCOUNT_ID:role/SageMakerExecutionRole'
    bucket = 'skill-demand-training-data'
    
    pipeline = SkillDemandTrainingPipeline(role, bucket)
    
    # Run pipeline
    pipeline.preprocess_data()
    pipeline.train_model()
    endpoint_name = pipeline.deploy_model('training_job_name')
    
    print(f'Model deployed to endpoint: {endpoint_name}')

if __name__ == '__main__':
    main()
