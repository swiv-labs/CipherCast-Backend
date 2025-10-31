"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../utils/errorHandler");
class UsersController {
    /**
     * Register a new user with Privy authentication
     * Supports: email, wallet, Google, Apple, Twitter, Discord, GitHub
     */
    static async register(req, res, next) {
        try {
            const { walletAddress, authMethod, authIdentifier, privyUserId, username, email, avatarUrl, isEmailVerified, } = req.body;
            // Check if user already exists by wallet address
            const existingUser = await User_1.UserModel.findByWallet(walletAddress);
            if (existingUser) {
                return (0, response_1.errorResponse)(res, 'User with this wallet already registered', null, 409);
            }
            // Check if auth identifier is already used (for email/google/external wallet)
            if (authMethod !== 'wallet') {
                const existingByAuth = await User_1.UserModel.findByAuthIdentifier(authIdentifier);
                if (existingByAuth) {
                    return (0, response_1.errorResponse)(res, `User with this ${authMethod} already registered`, null, 409);
                }
            }
            // Check if Privy user ID is already used
            if (privyUserId) {
                const existingByPrivy = await User_1.UserModel.findByPrivyId(privyUserId);
                if (existingByPrivy) {
                    return (0, response_1.errorResponse)(res, 'User with this Privy ID already registered', null, 409);
                }
            }
            // Create user
            const userParams = {
                walletAddress,
                authMethod,
                authIdentifier,
                privyUserId,
                username,
                email,
                avatarUrl,
                isEmailVerified,
            };
            const user = await User_1.UserModel.create(userParams);
            return (0, response_1.successResponse)(res, 'User registered successfully', {
                id: user.id,
                walletAddress: user.wallet_address,
                authMethod: user.auth_method,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatar_url,
                isEmailVerified: user.is_email_verified,
                createdAt: user.created_at,
            }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Login user - updates last login timestamp
     */
    static async login(req, res, next) {
        try {
            const { walletAddress, privyUserId } = req.body;
            let user = null;
            // Try to find by wallet address first
            if (walletAddress) {
                user = await User_1.UserModel.findByWallet(walletAddress);
            }
            // Fallback to Privy ID
            if (!user && privyUserId) {
                user = await User_1.UserModel.findByPrivyId(privyUserId);
            }
            if (!user) {
                throw new errorHandler_1.AppError('User not found. Please register first.', 404);
            }
            // Update last login
            await User_1.UserModel.updateLastLogin(user.wallet_address);
            return (0, response_1.successResponse)(res, 'Login successful', {
                id: user.id,
                walletAddress: user.wallet_address,
                authMethod: user.auth_method,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatar_url,
                isEmailVerified: user.is_email_verified,
                lastLoginAt: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user profile by wallet address
     */
    static async getProfile(req, res, next) {
        try {
            const { walletAddress } = req.params;
            const user = await User_1.UserModel.findByWallet(walletAddress);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            return (0, response_1.successResponse)(res, 'User profile retrieved', {
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
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user profile
     */
    static async updateProfile(req, res, next) {
        try {
            const { walletAddress } = req.params;
            const { username, avatarUrl } = req.body;
            const user = await User_1.UserModel.findByWallet(walletAddress);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            const updates = {};
            if (username !== undefined)
                updates.username = username;
            if (avatarUrl !== undefined)
                updates.avatar_url = avatarUrl;
            const updatedUser = await User_1.UserModel.update(walletAddress, updates);
            return (0, response_1.successResponse)(res, 'Profile updated successfully', {
                id: updatedUser.id,
                walletAddress: updatedUser.wallet_address,
                username: updatedUser.username,
                avatarUrl: updatedUser.avatar_url,
                updatedAt: updatedUser.updated_at,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get authentication statistics
     */
    static async getAuthStats(req, res, next) {
        try {
            const stats = await User_1.UserModel.getAuthMethodStats();
            return (0, response_1.successResponse)(res, 'Auth statistics retrieved', stats);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map