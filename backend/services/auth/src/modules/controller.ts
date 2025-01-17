import * as express from 'express';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Cognito from './cognito.service';
import ServiceCaller from "./serviceCaller";
import DBUtility from "../../../../utility/db/db"

class AuthController {

  // Signup new user without initial signin
  signUp = async(req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }

    const { email, password} = req.body;
    let userAttr = [];
    userAttr.push({ Name: 'email', Value: email});

    let cognitoService = new Cognito();
    
    cognitoService.signUpUser(email, password, userAttr)
      .then(success => {
        const responseMeta = success['$metadata'];
        const statusCode = success['$metadata'].httpStatusCode;
        const user = success['UserSub'];
        const errorType = success['__type'];
        res.status(statusCode).json({
          data: {
            "user":user,
            "responseMeta":responseMeta, 
            "errorType":errorType
          }
        })
      })
      .catch(err=>{
        res.status(500).json({"Error ": err})
      })
  }

  

  signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    let cognitoService = new Cognito();
    const dbUtility = new DBUtility();

    try {
        try {
            const response = await cognitoService.signInUser(username, password);
            const statusCode = response['$metadata']?.httpStatusCode;

            if (statusCode === 200) {
                
                return res.status(statusCode).json({
                    data: { "AuthenticationResult": response.AuthenticationResult }
                });
            } else if (response?.__type === "UserNotConfirmedException") {
                return res.status(statusCode).json({ message: "User is not confirmed. OTP resend initiated." });
            } else {
                return res.status(statusCode).json({ message: response?.__type || "Sign-in failed" });
            }
        } catch (err) {
            console.error("Error handling normal sign-in:", err);
        }

    } catch (err) {
        console.error("General error:", err);
    }

    return res.status(500).json({ message: "An unexpected error occurred" });
  };


  
  verifySignIn = (req: Request, res: Response) => {
    const user = req.body.user;
    return res.status(200).json({"Data ": user}).end()
  }

  verifySignUp = async (req: Request, res: Response) => {
    // Validate the request input
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(422).json({ errors: result.array() });
    }

    const { username, code } = req.body;

    let cognitoService = new Cognito();

    try {
      const response = await cognitoService.confirmSignUp(username, code);
      const responseMeta = response.$metadata;
      const statusCode = responseMeta.httpStatusCode;

      res.status(statusCode).json({
        data: {
          "responseMeta":responseMeta
        }
      })

    } catch (err) {
        // Return error response with appropriate status code and message
        return res.status(400).json({ "Error": err.message });
    }
  }

  resendEmailVerification= async (req: Request, res: Response) => {
    let cognitoService = new Cognito();
    
    try {
      const response = await cognitoService.ResendOtpForEmailConfirmation(req.body.username);
      return res.status(200).json(response );
    } catch (error) {
      throw error; // Handle errors
    }
  }

  // Forgot Password
  forgotPassword = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    const { username } = req.body;

    let cognitoService = new Cognito();
    cognitoService.forgotPassword(username)
      .then(success => {
        success ? res.status(200).json({"Data": success}).end(): res.status(400).end()
      });
  }

  // Confirm Forgot password after request forgot password
  confirmPassword = (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
    const { username, password, code } = req.body;

    let cognitoService = new Cognito();
    cognitoService.confirmForgotPassword(username, code, password)
      .then(success => {
        success ? res.status(200).json({"Data": success}).end(): res.status(400).end()
      })
  }

  // email change request
  changeEmailRequest = (req: Request, res: Response) => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }

    const { email } = req.body;
    const accessTocken = req.headers.authorization
    let cognitoService = new Cognito();

    cognitoService.changeEmailRequest(accessTocken, email)
      .then(response => {
        const responseMeta = response.$metadata;
        const statusCode = response.$metadata.httpStatusCode;
        res.status(statusCode).json({"Data": responseMeta})
      })
      .catch(error=>{
        res.status(403)
      })
  }

  changeEmailVerify = async (req: Request, res: Response) => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }

    const { code, email } = req.body;
    const accessToken = req.headers.authorization;
    let cognitoService = new Cognito();
    
    try {
      const response = await cognitoService.changeEmailVerify(accessToken, code);
        const responseMeta = response.$metadata;
        const responseMessage = response?.__type;
        const statusCode = response.$metadata.httpStatusCode;

        if (statusCode === 200) {
            const data = {
                email: email
            };
            const serviceCaller = new ServiceCaller();
            const resp = await serviceCaller.updateItem(accessToken, data);
            response ? res.status(statusCode).json({ "Data": responseMeta }).end() : res.status(400).end();
        }
        else {
          res.status(statusCode).json({ "data": responseMessage }).end()
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  getIpFromRequest = async (req) =>{
    try {
      // Check 'x-forwarded-for' header first
      const forwardedForHeader: string | undefined = req.headers['x-forwarded-for'];
      let clientIp: string | undefined;

      if (forwardedForHeader) {
          // The 'x-forwarded-for' header may contain multiple IP addresses separated by commas.
          // The client's IP address is usually the first one.
          const forwardedIps: string[] = forwardedForHeader.split(',');
          clientIp = forwardedIps[0].trim();
      } else {
          // If 'x-forwarded-for' header is not available, try 'x-real-ip'
          clientIp = req.headers['x-real-ip'];
      }

      if (!clientIp) {
          // If neither 'x-forwarded-for' nor 'x-real-ip' headers are present, use req.connection.remoteAddress
          clientIp = req.connection.remoteAddress;
      }

      return clientIp;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
  }


}

export default AuthController;