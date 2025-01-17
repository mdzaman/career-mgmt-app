import config from './config/config';
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand ,
  ScanCommand, 
  ListTablesCommand,
  QueryCommand,
  QueryCommandInput 
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export default class DBUtility {
  private readonly dynamoDBClient: DynamoDBClient;
  private config = {
    region: config.aws.region
  }

  constructor() {
    this.dynamoDBClient = new DynamoDBClient(this.config);
  }

  
  async getItem(tableName: string, key: string, keyValue: string): Promise<{ item?: any, error?: any }> {
    try {
      const Params = {
        TableName: tableName,
        Key: { [key]: { S: keyValue } }
      };

      const getItemCommand = new GetItemCommand(Params);
      const itemResult = await this.dynamoDBClient.send(getItemCommand);

      const item = unmarshall(itemResult?.Item);
      return { item };
    } catch (error) {
      console.error("Error fetching item", error);
      return { error: error.message };
    }
  }
  
}
