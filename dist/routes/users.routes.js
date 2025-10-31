"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const validator_1 = require("../utils/validator");
const errorHandler_1 = require("../utils/errorHandler");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
// User registration (Privy)
router.post('/register', (0, validator_1.validateRequest)(validator_1.userRegisterSchema), (0, errorHandler_1.asyncHandler)(users_controller_1.UsersController.register));
// User login
router.post('/login', (0, validator_1.validateRequest)(validator_1.userLoginSchema), (0, errorHandler_1.asyncHandler)(users_controller_1.UsersController.login));
// Get user profile
router.get('/:walletAddress', (0, errorHandler_1.asyncHandler)(users_controller_1.UsersController.getProfile));
// Update user profile
router.patch('/:walletAddress', (0, validator_1.validateRequest)(joi_1.default.object({
    username: joi_1.default.string().optional(),
    avatarUrl: joi_1.default.string().uri().optional(),
})), (0, errorHandler_1.asyncHandler)(users_controller_1.UsersController.updateProfile));
// Get auth method statistics
router.get('/stats/auth-methods', (0, errorHandler_1.asyncHandler)(users_controller_1.UsersController.getAuthStats));
exports.default = router;
//# sourceMappingURL=users.routes.js.map