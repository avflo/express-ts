import { Request, Response, NextFunction } from 'express';
import Joi  from 'joi';

function validate(data, schema){
    const { error } = Joi.object(schema).validate(data);
    return error;
}
function validationHandler(schema, check = "body"){
    return function (req: Request, res: Response, next: NextFunction){
        const validationError = validate(req[check], schema);
        if(validationError){
            const error = new Error(validationError.message);
            error['payload'] = validationError.details[0].context;
            error['status'] = 400;
            next(error);
        }else{
            next();
        }
    }
}


export default validationHandler;

