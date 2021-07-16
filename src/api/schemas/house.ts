// validation Schemas: check more here --> https://github.com/maghis/types-joi
//used to validate request values
import Joi  from 'joi';

const houseReqSchema = {
  name:                Joi.string().required(),
}


export {
  houseReqSchema,
};
