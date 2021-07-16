import { Request, Response, NextFunction} from 'express';
import config from '../../config';
import { Container } from 'typedi';
import { Logger } from 'winston';

function xApiKey(){
    return function (req: Request, res: Response, next: NextFunction){    
        const Logger : Logger = Container.get('logger');

        //set api keys allowed, so instead of compare string check if keys match as array identifiers in the collection 
        const apiKeys = new Map();
        apiKeys.set(config.apiKey, true); 

        if(!apiKeys || !apiKeys.has(req.get('x-api-key'))){
            const error = new Error('Authentication error');
            
            Logger.info("env", config.apiKey )
            Logger.info("req", req.get('x-api-key'))
            error['payload'] = '401';
            error['status'] = 401;
            next(error);
        }else{
            next();
        } 
    }
}

export default xApiKey;