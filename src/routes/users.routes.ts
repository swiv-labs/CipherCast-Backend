import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { validateRequest, userRegisterSchema, userLoginSchema } from '../utils/validator';
import { asyncHandler } from '../utils/errorHandler';
import Joi from 'joi';

const router = Router();

// User registration (Privy)
router.post(
  '/register',
  validateRequest(userRegisterSchema),
  asyncHandler(UsersController.register)
);

// User login
router.post(
  '/login',
  validateRequest(userLoginSchema),
  asyncHandler(UsersController.login)
);

// Get user profile
router.get(
  '/:walletAddress',
  asyncHandler(UsersController.getProfile)
);

// Update user profile
router.patch(
  '/:walletAddress',
  validateRequest(
    Joi.object({
      username: Joi.string().optional(),
      avatarUrl: Joi.string().uri().optional(),
    })
  ),
  asyncHandler(UsersController.updateProfile)
);

// Get auth method statistics
router.get(
  '/stats/auth-methods',
  asyncHandler(UsersController.getAuthStats)
);

export default router;