import config from '../../config/config';
import * as path from 'path';
import { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';

export default class MediaManagementService {
  private readonly REGION = config.aws.region;
  private readonly BUCKET_NAME = config.aws.s3.bucketName;
  private readonly s3Client:S3Client;

  constructor() {

    this.s3Client = new S3Client({
      region: this.REGION
    });
  }

  async uploadImageToS3(imagePath: string, filePath: string): Promise<{ imageUrl: string | null }> {
    try {
        const imageData = fs.readFileSync(imagePath);
        const extension = path.extname(filePath).toLowerCase(); // Get file extension

        let contentType: string;
        switch (extension) {
          case '.jpg':
          case '.jpeg':
              contentType = 'image/jpeg';
              break;
          case '.png':
              contentType = 'image/png';
              break;
          case '.webp':
              contentType = 'image/webp';
              break;
          case '.heic':
              contentType = 'image/heic';
              break;
          case '.pdf':
              contentType = 'application/pdf';
              break;
          // Add more cases for other file formats if needed
          default:
              throw new Error('Unsupported file format');
      }

        const command = new PutObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: filePath,
            Body: imageData,
            ContentType: contentType 
        });

        const response = await this.s3Client.send(command);

        if (response.$metadata.httpStatusCode === 200) {
            const imageUrl = filePath;
            return { imageUrl };
        } else {
            return { imageUrl: null };
        }
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        return { imageUrl: null };
    }
}

  async getSignedUrl(imageGallery: any): Promise<any> {

    if(imageGallery){
      const presignedURLs = await Promise.all(imageGallery.map(async (item: any) => {
          
          const params = {
            Bucket: this.BUCKET_NAME,
            Key: item.url, 
            Expires: 3600 
          }
      
          const getObjectCommand = new GetObjectCommand(params);
          const presignedURL = await getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: params.Expires })
          return {
            url:presignedURL,
            status: item.status
          };
      }));
  
      return presignedURLs

    }else {
      return false;
    }
  }

  async getPresignedIdentityDocs(url: any): Promise<any> {


    if(url){

      const params = {
        Bucket: this.BUCKET_NAME,
        Key: url, 
        Expires: 3600 
      }
      const getObjectCommand = new GetObjectCommand(params);
      const presignedURL = await getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: params.Expires })
     
      return {
        url:presignedURL
      };

    }else {
      return false;
    }
  }

}
   