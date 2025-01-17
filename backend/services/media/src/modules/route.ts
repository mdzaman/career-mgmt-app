import * as express from 'express'
import MediaServiceController from './controller';
import multer from "multer";


const upload = multer({ dest: 'uploads/' }); // Define your upload directorydo
const mediaServiceController = new MediaServiceController();

export default class ServiceRoutes {
  public path = '/media'
  public router = express.Router()

  constructor() {
      this.initRoutes()
  }
  
  public initRoutes() {
    this.router.post('/uploadphoto',
      upload.single('imageData'), 
      mediaServiceController.uploadMedia)
  }
}
