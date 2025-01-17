import 'dotenv/config';
declare const config: {
    env: any;
    port: any;
    aws: {
        cognito: {
            region: any;
            clientId: any;
            clientSecret: any;
            secretHash: any;
            userPoolId: any;
        };
    };
};
export default config;
