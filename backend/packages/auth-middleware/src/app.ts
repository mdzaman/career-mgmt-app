
import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import jwksClient, { CertSigningKey } from 'jwks-rsa';
import config from '../config/config';

interface CustomSigningKey extends CertSigningKey {
  rsaPublicKey?: string;
}

function getKey(header: any, callback: VerifyCallback, req: Request, res: Response, next: NextFunction) {
  const poolRegion: string = config.aws.cognito.region;
  const userPoolId: string = config.aws.cognito.userPoolId;

  const client = jwksClient({
    jwksUri: `https://cognito-idp.${poolRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
  });

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(null,err);
    }

    const customKey: CustomSigningKey = key as CustomSigningKey;
    const signingKey = customKey.rsaPublicKey || customKey.publicKey;
    callback(null, signingKey);
  });
}

export function validateJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, getKey.bind(this), (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // req.body = decoded as { [key: string]: any };
    // You might adjust the type as per your payload
    req.body = { ...req.body, ...decoded };
    next();
  });
}

