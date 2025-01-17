import config from './config/config';
import { SNSClient, 
  PublishCommand,
  CreatePlatformEndpointCommand, 
  SubscribeCommand,
  SetEndpointAttributesCommand,
  ListEndpointsByPlatformApplicationCommand   } from '@aws-sdk/client-sns';
import { DynamoDBClient, PutItemCommand,UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

export default class SNSNotificationService {
  private readonly snsClient;
  private readonly dynamoDBClient;
  private config = {
    region: config.aws.region, // Use the region from your config file
  };

  constructor() {
    // Initialize the SNS client
    this.snsClient = new SNSClient(this.config);
    this.dynamoDBClient = new DynamoDBClient({ region: config.aws.region });
  }


  async sendNotificationTopic(messageData: { title: string, description: string, image: string }, topicArn: string): Promise<{ status: string }> {
    try {
      // Convert the message object into a string (e.g., JSON)
      const message = JSON.stringify({
        title: messageData.title,
        description: messageData.description,
        image: messageData.image,
      });

      // Set SNS message attributes
      const params = {
        Message: message,  // The message formatted as JSON
        TopicArn: topicArn,
        MessageAttributes: {
          'title': {
            DataType: 'String',
            StringValue: messageData.title,
          },
          'description': {
            DataType: 'String',
            StringValue: messageData.description,
          },
          'image': {
            DataType: 'String',
            StringValue: messageData.image,
          },
        }
      };

      // Send the message to the SNS topic
      const data = await this.snsClient.send(new PublishCommand(params));

      return { status: `Message sent successfully with ID: ${data.MessageId}` };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  async sendNotificationTarget(messageData: { title: string, description: string, image: string }, targetArn: string): Promise<{ status: string }> {
    try {
      // Convert the message object into a string (e.g., JSON)
      const message = JSON.stringify({
        title: messageData.title,
        description: messageData.description,
        image: messageData.image,
      });

      // Set SNS message attributes
      const params = {
        Message: message,  
        TargetArn: targetArn,
        MessageAttributes: {
          'title': {
            DataType: 'String',
            StringValue: messageData.title,
          },
          'description': {
            DataType: 'String',
            StringValue: messageData.description,
          },
          'image': {
            DataType: 'String',
            StringValue: messageData.image,
          },
        }
      };

      // Send the message to the SNS topic
      const data = await this.snsClient.send(new PublishCommand(params));

      return { status: `Message sent successfully with ID: ${data.MessageId}` };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  async ensurePlatformEndpoint(deviceToken: string, platformApplicationArn: string,   userId: string): Promise<string> {
    try {
      const existingEndpointArn = await this.findEndpointByToken(deviceToken, platformApplicationArn);


      if (existingEndpointArn) {
        await this.updatePlatformEndpoint(deviceToken, existingEndpointArn,  userId);
        return existingEndpointArn;
      } else {
        return await this.createPlatformEndpoint(deviceToken, platformApplicationArn, userId);
      }
    } catch (error) {
      console.error("Error ensuring platform endpoint:", error);
      throw new Error(`Failed to ensure platform endpoint: ${error.message}`);
    }
  }

  async createPlatformEndpoint(deviceToken: string, platformApplicationArn: string, userId: string): Promise<string> {
    try {
      const params = {
        Token: deviceToken,                        // The device token from the app
        PlatformApplicationArn: platformApplicationArn, // ARN of the platform application (APNS or FCM)
        // CustomUserData: userId                     // Pass the user ID here
      };
  
      const data = await this.snsClient.send(new CreatePlatformEndpointCommand(params));
      return data.EndpointArn;
    } catch (error) {
      throw new Error(`Failed to create platform endpoint: ${error.message}`);
    }
  }
  async updatePlatformEndpoint(deviceToken: string, endpointArn: string,  userId: string): Promise<void> {
    try {
      const params = {
        EndpointArn: endpointArn,
        Attributes: {
          Token: deviceToken,                  // Update the device token
          CustomUserData: userId,              // Update the user ID if needed
          Enabled: "true"                      // Enable the endpoint if it's disabled
        },
      };

      await this.snsClient.send(new SetEndpointAttributesCommand(params));
    } catch (error) {
      console.error("Error updating platform endpoint:", error);
      throw new Error(`Failed to update platform endpoint: ${error.message}`);
    }
  }

  private async findEndpointByToken(deviceToken: string, platformApplicationArn: string): Promise<string | null> {
    try {
      const command = new ListEndpointsByPlatformApplicationCommand({
        PlatformApplicationArn: platformApplicationArn,
      });
      
      const response = await this.snsClient.send(command);
      
      for (const endpoint of response.Endpoints || []) {
        if (endpoint.Attributes?.Token === deviceToken) {
          return endpoint.EndpointArn || null;
        }
      }
      
      return null;  // Return null if no endpoint matches the token
    } catch (error) {
      console.error("Error finding endpoint by token:", error);
      throw error;
    }
  }

  // Method to subscribe platform endpoint to a topic
  async subscribeEndpointToTopic(endpointArn: string, topicArn: string): Promise<string> {
    try {
      const params = {
        Protocol: 'application',  // Use 'application' protocol for platform endpoints
        TopicArn: topicArn,       // The SNS topic ARN
        Endpoint: endpointArn,    // The platform endpoint ARN
      };

      const data = await this.snsClient.send(new SubscribeCommand(params));
      return data.SubscriptionArn;  // Return the subscription ARN
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw new Error(`Failed to subscribe endpoint to topic: ${error.message}`);
    }
  }

  async createNotification(
    userId: string,
    receiverId: string,
    notificationType: string,
    activityType:string,
    actionRoute:string,
    messageData: { title: string,
    description: string,
    image?: string }
  ): Promise<{ notificationId: string }> {
    const notificationId = uuidv4(); // Generate a unique ID for the notification

    const params = {
      TableName: 'notifications',
      Item: {
        id: { S: notificationId },
        senderId: { S: userId },
        receiverId: { S: receiverId },
        title: { S: messageData.title },
        description: { S: messageData.description },
        notificationType: { S: notificationType },
        activityType: { S: activityType },
        actionRoute: { S: actionRoute },
        
        status: { S: 'unread' },
        updatedAt: { S: new Date().toISOString() },
        createdAt: { S: new Date().toISOString() }
      }
    };

    try {
      await this.dynamoDBClient.send(new PutItemCommand(params));
      return { notificationId };
    } catch (error) {
      throw new Error('Failed to store notification');
    }
  }

  async updateNotificationStatus(notificationId: string, status: string): Promise<{ status: string }> {
    const params = {
      TableName: 'notifications',  // Your DynamoDB table name
      Key: {
        id: { S: notificationId },  // The ID of the notification to update
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',  // Update both 'status' and 'updatedAt'
      ExpressionAttributeNames: {
        '#status': 'status',  // Map '#status' to the 'status' attribute
        '#updatedAt': 'updatedAt',  // Map '#updatedAt' to the 'updatedAt' attribute
      },
      ExpressionAttributeValues: {
        ':status': { S: 'read' },  
        ':updatedAt': { S: new Date().toISOString() }, 
      }
    };
    
    try {
      const data = await this.dynamoDBClient.send(new UpdateItemCommand(params));
      return { status: `Notification status updated to ${status}` };
    } catch (error) {
      throw new Error('Failed to update notification status');
    }
  }
}
