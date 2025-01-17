import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),

    AWSREGION: Joi.string().optional(),
    AWSREGION_PRODUCTION: Joi.string().optional(),

    BUCKETNAME: Joi.string().optional(),
    BUCKETNAME_PRODUCTION: Joi.string().optional(),

    ACCESSKEY: Joi.string().optional(),
    ACCESSKEY_PRODUCTION: Joi.string().optional(),

    SECRETKEY: Joi.string().optional(),
    SECRETKEY_PRODUCTION: Joi.string().optional(),
  })
  // Ensure at least one key from each pair is provided
  .or('AWSREGION', 'AWSREGION_PRODUCTION')
  .or('BUCKETNAME', 'BUCKETNAME_PRODUCTION')
  .or('ACCESSKEY', 'ACCESSKEY_PRODUCTION')
  .or('SECRETKEY', 'SECRETKEY_PRODUCTION')
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Dynamically select the appropriate values based on NODE_ENV
const config = {
  env: envVars.NODE_ENV,
  aws: {
    region: envVars.NODE_ENV === 'production' ? envVars.AWSREGION_PRODUCTION : envVars.AWSREGION,
    s3: {
      bucketName: envVars.NODE_ENV === 'production' ? envVars.BUCKETNAME_PRODUCTION : envVars.BUCKETNAME,
      accessKey: envVars.NODE_ENV === 'production' ? envVars.ACCESSKEY_PRODUCTION : envVars.ACCESSKEY,
      secretKey: envVars.NODE_ENV === 'production' ? envVars.SECRETKEY_PRODUCTION : envVars.SECRETKEY,
    },
  },
};

export default config;