"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizePoolSchema = exports.claimRewardSchema = exports.createPredictionSchema = exports.createPoolSchema = exports.userLoginSchema = exports.userRegisterSchema = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const response_1 = require("./response");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map((d) => d.message).join(', ');
            return (0, response_1.errorResponse)(res, 'Validation error', errorMessage, 400);
        }
        next();
    };
};
exports.validateRequest = validateRequest;
// Validation Schemas
// User Registration Schema (Updated for Privy)
exports.userRegisterSchema = joi_1.default.object({
    walletAddress: joi_1.default.string().required(),
    authMethod: joi_1.default.string()
        .valid('email', 'wallet', 'google', 'apple', 'twitter', 'discord', 'github')
        .required(),
    authIdentifier: joi_1.default.string().required(),
    privyUserId: joi_1.default.string().optional(),
    username: joi_1.default.string().optional().allow(''),
    email: joi_1.default.string().email().optional().allow(''),
    avatarUrl: joi_1.default.string().uri().optional().allow(''),
    isEmailVerified: joi_1.default.boolean().optional(),
});
// User Login Schema
exports.userLoginSchema = joi_1.default.object({
    walletAddress: joi_1.default.string().required(),
    privyUserId: joi_1.default.string().optional(),
});
exports.createPoolSchema = joi_1.default.object({
    assetSymbol: joi_1.default.string().required(),
    targetPrice: joi_1.default.number().positive().required(),
    endTime: joi_1.default.string().isoDate().required(),
    creator: joi_1.default.string().required(),
});
exports.createPredictionSchema = joi_1.default.object({
    poolId: joi_1.default.string().uuid().required(),
    userWallet: joi_1.default.string().required(),
    predictedPrice: joi_1.default.number().positive().required(),
    // direction: Joi.string().valid('up', 'down').required(),
    amount: joi_1.default.number().positive().required(),
});
exports.claimRewardSchema = joi_1.default.object({
    userWallet: joi_1.default.string().required(),
});
exports.finalizePoolSchema = joi_1.default.object({
    finalizedBy: joi_1.default.string().optional(),
});
//# sourceMappingURL=validator.js.map