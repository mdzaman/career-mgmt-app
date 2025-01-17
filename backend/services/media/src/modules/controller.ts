
import sharp from "sharp"
import ServiceCaller from "./serviceCaller"
import MediaManagementService from './media-management.service';
import * as path from 'path';
import fs from 'fs';
const now = new Date;

class MediaServiceController {
    
    uploadMedia = async (req, res) => {
        try {
            const mediaManagementService = new MediaManagementService();
            const serviceCaller = new ServiceCaller();
            const accessToken = req.headers.authorization;
            const username = req.body.username;
    
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
    
            const imagePath = req.file.path;
            const timestamp = new Date().getTime();
            const fileExtension = path.extname(req.file.originalname).toLowerCase();
            const fileName = `${timestamp}${fileExtension}`;
            const fileLocationForStorage = `${username}/${fileName}`;
    
            // Upload original file to S3
            const uploadResult = await mediaManagementService.uploadImageToS3(
                imagePath, 
                fileLocationForStorage
            );
    
            // Clean up the temporary file
            fs.unlink(imagePath, (err) => { 
                if (err) console.error(err); 
            });
    
            // Update gallery with the new image
            const data = {
                originalUrl: uploadResult.imageUrl,
                status: "pending"
            };
    
            const response = await serviceCaller.updateGalleryItem(accessToken, data);
    
            if (response.data.status === 200) {
                res.status(200).json({ message: "Image uploaded and profile updated" });
            } else {
                res.status(200).json({ message: "Image uploaded but profile not updated" });
            }
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    };

    
    getPresignedMedia = async (req, res) => {
        const mediaManagementService = new MediaManagementService();
        const resp = await mediaManagementService.getSignedUrl(req.body.imageGallery);
        res.status(200).json(resp);
    }

    getPresignedIdentity = async (req, res) => {
        const mediaManagementService = new MediaManagementService();
        const resp = await mediaManagementService.getPresignedIdentityDocs(req.body.url);
        res.status(200).json(resp.url);
        
    }

}


export default MediaServiceController;
