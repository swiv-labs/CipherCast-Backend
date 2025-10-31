import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const userRegisterSchema: Joi.ObjectSchema<any>;
export declare const userLoginSchema: Joi.ObjectSchema<any>;
export declare const createPoolSchema: Joi.ObjectSchema<any>;
export declare const createPredictionSchema: Joi.ObjectSchema<any>;
export declare const claimRewardSchema: Joi.ObjectSchema<any>;
export declare const finalizePoolSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=validator.d.ts.map