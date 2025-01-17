import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    PORT: Joi.number().default(8000),
    AWSREGION : Joi.string().required(), 
    CLIENTID : Joi.string().required(), 
    CLIENTSECRET : Joi.string().required(), 
    SECRETHASH : Joi.string().required(), 
    USERPOOLID : Joi.string().required(), 
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  aws: {
    cognito: {
      region: envVars.AWSREGION,
      clientId: envVars.CLIENTID,
      clientSecret: envVars.CLIENTSECRET,
      secretHash: envVars.SECRETHASH,
      userPoolId: envVars.USERPOOLID,
    }
  }
};

export default config;
