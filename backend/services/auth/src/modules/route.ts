import * as express from 'express'
import { Request, Response } from 'express';
import AuthController from './controller';

const authController = new AuthController();

export default class AuthRoutes {
    public path = '/auth'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
      this.router.post('/signup', authController.signUp)
      this.router.post('/signin', authController.signIn)
      this.router.post('/confirm', authController.verifySignUp)
      this.router.post('/forgotpassword', authController.forgotPassword)
      this.router.post('/confirmpassword', authController.confirmPassword)
      this.router.post('/changeemailrequest', authController.changeEmailRequest)
      this.router.post('/changeemailverify', authController.changeEmailVerify)
      this.router.post('/resendotp', authController.resendEmailVerification)
    }
}