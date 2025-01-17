import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'staging').required(),
    AWSREGION : Joi.string().required(), 
    
    AUTH_SERVICE : Joi.string().required(),
    USER_MANAGEMENT_SERVICE : Joi.string().required(),
    SEARCH_SERVICE : Joi.string().required(),
    MEDIA_SERVICE : Joi.string().required(),
  })
  .unknown();
  

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  aws: {
    region: envVars.AWSREGION
  },
  service: {
    authservice : envVars.AUTH_SERVICE,
    usermanagement : envVars.USER_MANAGEMENT_SERVICE,
    searchservice : envVars.SEARCH_SERVICE,
    mediaservice : envVars.MEDIA_SERVICE
  }
};

export default config;
