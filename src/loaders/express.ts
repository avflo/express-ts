import express from 'express';
import routes from  '../api/routes/router';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import config from '../config';
import { Container } from 'typedi';
import { Logger } from 'winston';

//const bodyParser = require('body-parser');

export default async ({ app }: { app: express.Application }) => {

    const Logger : Logger = Container.get('logger');

    app.enable('trust proxy');

    // Secure connection
    app.use(helmet());
    app.use(cors({
        // enable this and check request headers
        //you could see => Access-Control-Expose-Headers: Authorization
        origin: '*',
        exposedHeaders: 'Authorization'
    }))

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Parser
    app.use(cookieParser() as any);

    // Instance route
    app.use('/api/', routes());

    /**
    * Error handlers
    *
    * Note: This code need to be at end of file, 
    * well at last just before start the app (app.listen). 
    * For more info check -> 
    * https://stackoverflow.com/questions/29700005/express-4-middleware-error-handler-not-being-called 
    */

    // 404 - set it allways after router instance! 
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err['status'] = 404;
        err['payload'] = 'route or method not found';
        next(err);
    });
    
    app.use((err, req, res, next) => {
        return next(err);
    });

    app.use((err, req, res, next) => {
        Logger.error('🔥 %o', err);
        res.status(err.status || 500);
        res.json({
          ok: false,
          errors: {
              status:   err.status ? err.status : 500,
              message:  err.message ? err.message : 'unknow',
              payload:  err.payload ? err.payload : 'unknow'
          }  
        });
    });

}