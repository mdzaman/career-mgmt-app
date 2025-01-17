import config from './config/config';
import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";


export default class EmailSenderUtility {
  private readonly sesClient
  private config = {
    region: config.aws.region,
  }

  constructor() {

    this.sesClient = new SESClient(this.config);

  }
  async sendEmail(receiver: string, template:string,templateData:object): Promise<{ status: string }> {
    try {

      const params = {
        Source: '"Noble Marriage" <info@noblemarriage.com>',
        Destination: {
          ToAddresses: [receiver]
        },
        Template: template,
        TemplateData: JSON.stringify(templateData)
      };
      const data = await this.sesClient.send(new SendTemplatedEmailCommand(params));
      return data;

    } catch (error) {
        console.error("Error creating order:", error);
    }
  }
  
}
   