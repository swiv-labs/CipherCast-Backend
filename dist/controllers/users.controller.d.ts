import { Request, Response, NextFunction } from 'express';
export declare class UsersController {
    /**
     * Register a new user with Privy authentication
     * Supports: email, wallet, Google, Apple, Twitter, Discord, GitHub
     */
    static register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Login user - updates last login timestamp
     */
    static login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get user profile by wallet address
     */
    static getProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Update user profile
     */
    static updateProfile(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get authentication statistics
     */
    static getAuthStats(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=users.controller.d.ts.map