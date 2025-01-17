import config from './config/config';
import { addDays, isAfter } from "date-fns";

import {
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export default class PaymentUtility {
  private readonly dynamoDBClient: DynamoDBClient;
  private config = {
    region: config.aws.region,
  }

  constructor() {

    this.dynamoDBClient = new DynamoDBClient(this.config);

  }

  async verifyPayments(orderId: string): Promise<{ status: string, order: any, pricingPlan?: any, error?: any }> {
    try {
      const result = "success";
      if (true) {
        return result;

      } else {
        return result;
      }
    } catch (error) {
      return error;
    }
  }
}
