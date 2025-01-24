service: career-path-prediction

provider:
  name: aws
  runtime: python3.9
  stage: ${opt:stage, 'dev'}
  region: ${opt:region, 'us-east-1'}
  
  environment:
    PREDICTIONS_TABLE: ${self:service}-predictions-${opt:stage, 'dev'}
    SAGEMAKER_ENDPOINT: ${self:service}-endpoint-${opt:stage, 'dev'}
  
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
      Resource: 
        - "arn:aws:dynamodb:${opt:region, 'us-east-1'}:*:table/${self:provider.environment.PREDICTIONS_TABLE}"
    - Effect: Allow
      Action:
        - sagemaker:InvokeEndpoint
      Resource: "*"

functions:
  api:
    handler: app.handler
    events:
      - http:
          path: /api/v1/career-prediction
          method: post
          cors: true
      - http:
          path: /api/v1/career-prediction/{user_id}
          method: get
          cors: true
      - http:
          path: /admin/metrics
          method: get
          cors: true
          authorizer: aws_iam
      - http:
          path: /admin/model/performance
          method: get
          cors: true
          authorizer: aws_iam

resources:
  Resources:
    PredictionsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.PREDICTIONS_TABLE}
        AttributeDefinitions:
          - AttributeName: user_id
            AttributeType: S
          - AttributeName: timestamp
            AttributeType: S
        KeySchema:
          - AttributeName: user_id
            KeyType: HASH
          - AttributeName: timestamp
            KeyType: RANGE
        BillingMode: PAY_PER_REQUEST
        
    CloudWatchDashboard:
      Type: AWS::CloudWatch::Dashboard
      Properties:
        DashboardName: ${self:service}-dashboard-${opt:stage, 'dev'}
        DashboardBody: 
          Fn::Sub: |
            {
              "widgets": [
                {
                  "type": "metric",
                  "properties": {
                    "metrics": [
                      ["AWS/Lambda", "Invocations", "FunctionName", "${self:service}-${opt:stage, 'dev'}-api"]
                    ],
                    "period": 300,
                    "stat": "Sum",
                    "region": "${opt:region, 'us-east-1'}",
                    "title": "API Invocations"
                  }
                }
              ]
            }
