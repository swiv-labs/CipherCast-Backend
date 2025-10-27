import { Request, Response, NextFunction } from 'express';
import { UserModel, CreateUserParams } from '../models/User';
import { successResponse, errorResponse } from '../utils/response';
import { AppError } from '../utils/errorHandler';

export class UsersController {
  /**
   * Register a new user with Privy authentication
   * Supports: email, wallet, Google, Apple, Twitter, Discord, GitHub
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        walletAddress,
        authMethod,
        authIdentifier,
        privyUserId,
        username,
        email,
        avatarUrl,
        isEmailVerified,
      } = req.body;

      // Check if user already exists by wallet address
      const existingUser = await UserModel.findByWallet(walletAddress);
      if (existingUser) {
        return errorResponse(res, 'User with this wallet already registered', null, 409);
      }

      // Check if auth identifier is already used (for email/google/external wallet)
      if (authMethod !== 'wallet') {
        const existingByAuth = await UserModel.findByAuthIdentifier(authIdentifier);
        if (existingByAuth) {
          return errorResponse(
            res,
            `User with this ${authMethod} already registered`,
            null,
            409
          );
        }
      }

      // Check if Privy user ID is already used
      if (privyUserId) {
        const existingByPrivy = await UserModel.findByPrivyId(privyUserId);
        if (existingByPrivy) {
          return errorResponse(res, 'User with this Privy ID already registered', null, 409);
        }
      }

      // Create user
      const userParams: CreateUserParams = {
        walletAddress,
        authMethod,
        authIdentifier,
        privyUserId,
        username,
        email,
        avatarUrl,
        isEmailVerified,
      };

      const user = await UserModel.create(userParams);

      return successResponse(
        res,
        'User registered successfully',
        {
          id: user.id,
          walletAddress: user.wallet_address,
          authMethod: user.auth_method,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatar_url,
          isEmailVerified: user.is_email_verified,
          createdAt: user.created_at,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user - updates last login timestamp
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress, privyUserId } = req.body;

      let user = null;

      // Try to find by wallet address first
      if (walletAddress) {
        user = await UserModel.findByWallet(walletAddress);
      }

      // Fallback to Privy ID
      if (!user && privyUserId) {
        user = await UserModel.findByPrivyId(privyUserId);
      }

      if (!user) {
        throw new AppError('User not found. Please register first.', 404);
      }

      // Update last login
      await UserModel.updateLastLogin(user.wallet_address);

      return successResponse(res, 'Login successful', {
        id: user.id,
        walletAddress: user.wallet_address,
        authMethod: user.auth_method,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatar_url,
        isEmailVerified: user.is_email_verified,
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile by wallet address
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.params;

      const user = await UserModel.findByWallet(walletAddress);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return successResponse(res, 'User profile retrieved', {
        id: user.id,
        walletAddress: user.wallet_address,
        username: user.username,
        authMethod: user.auth_method,
        email: user.email,
        avatarUrl: user.avatar_url,
        isEmailVerified: user.is_email_verified,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.params;
      const { username, avatarUrl } = req.body;

      const user = await UserModel.findByWallet(walletAddress);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const updates: any = {};
      if (username !== undefined) updates.username = username;
      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

      const updatedUser = await UserModel.update(walletAddress, updates);

      return successResponse(res, 'Profile updated successfully', {
        id: updatedUser.id,
        walletAddress: updatedUser.wallet_address,
        username: updatedUser.username,
        avatarUrl: updatedUser.avatar_url,
        updatedAt: updatedUser.updated_at,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get authentication statistics
   */
  static async getAuthStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await UserModel.getAuthMethodStats();
      return successResponse(res, 'Auth statistics retrieved', stats);
    } catch (error) {
      next(error);
    }
  }
}