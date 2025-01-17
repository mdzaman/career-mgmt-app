
import App from './app';
import * as bodyParser from 'body-parser';
import config from '../config/config';
import morgan from "morgan";
import cors from "cors";

import ServiceRoutes from './modules/route';
const app = new App({
    port: config.port,
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        morgan('dev'),
        cors()
    ],
    routes: [
        new ServiceRoutes()
    ]
})

app.listen()