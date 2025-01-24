# Career Path Prediction Service Deployment Guide

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 16+ and npm
- Python 3.9+
- Serverless Framework CLI
- Docker

## Step 1: Backend Deployment

1. Set up environment:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Deploy serverless infrastructure:
```bash
serverless deploy --stage prod --region us-east-1
```

3. Configure SageMaker endpoint:
```bash
aws sagemaker create-endpoint-config --endpoint-config-name career-prediction-config
aws sagemaker create-endpoint --endpoint-name career-prediction-endpoint
```

## Step 2: Frontend Deployment

1. Install dependencies:
```bash
npm install
```

2. Build frontend:
```bash
npm run build
```

3. Deploy to S3 and CloudFront:
```bash
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Step 3: Monitoring Setup

1. Configure CloudWatch Dashboard:
```bash
aws cloudwatch put-dashboard --dashboard-name career-prediction-dashboard
```

2. Set up alarms:
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name api-error-rate \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

## Step 4: Security Configuration

1. Configure WAF:
```bash
aws wafv2 create-web-acl --name career-prediction-waf
```

2. Set up SSL certificate:
```bash
aws acm request-certificate --domain-name your-domain.com
```

## Verification Steps

1. Test API endpoints:
```bash
curl -X POST https://api.your-domain.com/api/v1/career-prediction \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","skills":["python"]}'
```

2. Verify monitoring:
- Check CloudWatch dashboard
- Test alerts
- Verify metrics collection

## Rollback Procedure

1. Infrastructure rollback:
```bash
serverless remove --stage prod
```

2. Manual cleanup:
- Delete SageMaker endpoint
- Remove CloudWatch resources
- Delete WAF configuration

## Maintenance

- Monitor CloudWatch metrics daily
- Review and rotate API keys monthly
- Update dependencies quarterly
- Perform load testing bi-monthly
