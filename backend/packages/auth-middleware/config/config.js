"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
require("dotenv/config");
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development', 'staging').required(),
    PORT: joi_1.default.number().default(8000),
    AWSREGION: joi_1.default.string().required(),
    USERPOOLID: joi_1.default.string().required(),
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
            userPoolId: envVars.USERPOOLID,
        }
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map