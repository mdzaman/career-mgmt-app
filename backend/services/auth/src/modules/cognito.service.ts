import {createHmac} from 'node:crypto';
import config from '../../config/config';

import {
    SignUpCommand,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    CognitoIdentityProviderClient,
    VerifyUserAttributeCommand,
    ResendConfirmationCodeCommand,
    UpdateUserAttributesCommand,
    ListUsersCommand,
    AdminGetUserCommand 
  } from "@aws-sdk/client-cognito-identity-provider";


export default class Cognito {
  private config = {
    region: config.aws.cognito.region,
  }

  private cognitoIdentity;
  private clientId = config.aws.cognito.clientId;
  private secretHash = config.aws.cognito.secretHash;
  private userPoolID = config.aws.cognito.userPoolId;

  constructor(){
    this.cognitoIdentity = new CognitoIdentityProviderClient(this.config)
  }

  // Sign Up Method
  public async signUpUser(username: string, password: string, userAttr: Array<any>): Promise<any> {
    
    const params = new SignUpCommand({
        ClientId: this.clientId,
        SecretHash: this.generateSecrethash(username),
        Username: username,
        Password: password,
        UserAttributes: userAttr,
    });

    try {

      const signupresp = await this.cognitoIdentity.send(params);
      const resp = {
        "signupresponse":signupresp
      }
        return resp; 
    } catch (error) {
        return error; 
    }
  }

  // Sign in User
  public async signInUser(username: string, password: string): Promise<any> {
    const params = new InitiateAuthCommand (
      {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          'USERNAME': username,
          'PASSWORD': password,
          'SECRET_HASH': this.generateSecrethash(username)
        },
      }
    )

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp; 
    } catch (error) {
        return error; 
    }
  }

  // Account confirm after Sign up
  public async confirmSignUp(username: string, code: string): Promise<any> {

    const params = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      SecretHash: this.generateSecrethash(username),
      Username: username,
      ConfirmationCode: code
    });

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp; 
    } catch (error) {
        return error; 
    }
  }

  public async forgotPassword(username: string): Promise<any> {

    const params = new ForgotPasswordCommand(
      {
        ClientId: this.clientId,
        Username: username,
        SecretHash: this.generateSecrethash(username),
      }
    )


    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp
    } catch (error) {
      return error;
    }
  }

  public async confirmForgotPassword(username: string, code: string, password: string ): Promise<any> {

    const params = new ConfirmForgotPasswordCommand(
      {
        ClientId: this.clientId,
        SecretHash: this.generateSecrethash(username),
        Username: username,
        ConfirmationCode: code,
        Password: password,
        
      }
    )

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp
    } catch (error) {
      return error;
    }
  }

  public async changeEmailRequest(accessTocken: string, email: string): Promise<any> {

    const params = new UpdateUserAttributesCommand(
      {
        AccessToken: accessTocken,
        UserAttributes: [
          {
            Name: "email",
            Value: email
          }
        ]
      }
    )

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp
    } catch (error) {
      return error;
    }
  }

  public async changeEmailVerify(accessTocken: string, code: string): Promise<any> {

    const params = new VerifyUserAttributeCommand(
      {
        AccessToken: accessTocken, // The access token of the authenticated user
        AttributeName: "email",
        Code: code // The OTP/code received in the email
      }
    )

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp
    } catch (error) {
      return error;
    }
  }

  public async ResendOtpForEmailConfirmation(username:string): Promise<any> {

    const params = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      SecretHash: this.generateSecrethash(username),
      Username: username
    });

    try {
      const resp = await this.cognitoIdentity.send(params);
      return resp
    } catch (error) {
      return error;
    }
  }

  public async userExistExceptionCheck(email:string): Promise<any> {
    console.log("userPoolID",this.userPoolID)
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: this.userPoolID, // Replace with your actual Cognito User Pool ID
      Filter: `email = \"${email}\"` // Search by email
    });

    try {
      const resp = await this.cognitoIdentity.send(listUsersCommand);
      if(resp.Users && resp.Users.length > 0){
        return true

      }else {
        return false;
      }
    } catch (error) {
      return error;
    }
  }

  public async userStatusCheck(username:string): Promise<any> {

    const command = new AdminGetUserCommand({
      UserPoolId: this.userPoolID, // Your Cognito User Pool ID
      Username: username,              // The username of the user to check
    });

    try {
      const resp = await this.cognitoIdentity.send(command);
      return resp.UserStatus
    } catch (error) {
      return error;
    }
  }

  // Generate Hash Code for extra leyer request security
  private generateSecrethash(username: string): string {
    const hash = createHmac('sha256', this.secretHash)
                  .update(username + this.clientId)
                  .digest('base64');

    return hash;
  }

}