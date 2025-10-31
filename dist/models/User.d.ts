export interface User {
    id: string;
    wallet_address: string;
    username?: string;
    auth_method: 'email' | 'wallet' | 'google' | 'apple' | 'twitter' | 'discord' | 'github';
    auth_identifier: string;
    privy_user_id?: string;
    email?: string;
    avatar_url?: string;
    is_email_verified: boolean;
    created_at: string;
    last_login_at: string;
    updated_at: string;
}
export interface CreateUserParams {
    walletAddress: string;
    authMethod: User['auth_method'];
    authIdentifier: string;
    privyUserId?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
    isEmailVerified?: boolean;
}
export declare class UserModel {
    /**
     * Create a new user with Privy authentication details
     */
    static create(params: CreateUserParams): Promise<User>;
    /**
     * Find user by wallet address (Privy embedded wallet)
     */
    static findByWallet(walletAddress: string): Promise<User | null>;
    /**
     * Find user by Privy user ID (DID)
     */
    static findByPrivyId(privyUserId: string): Promise<User | null>;
    /**
     * Find user by auth identifier (email or external wallet)
     */
    static findByAuthIdentifier(authIdentifier: string): Promise<User | null>;
    /**
     * Find user by any identifier (wallet, email, or auth_identifier)
     */
    static findByAnyIdentifier(identifier: string): Promise<User | null>;
    /**
     * Update user details
     */
    static update(walletAddress: string, updates: Partial<User>): Promise<User>;
    /**
     * Update last login timestamp
     */
    static updateLastLogin(walletAddress: string): Promise<void>;
    /**
     * Get users by auth method
     */
    static findByAuthMethod(authMethod: User['auth_method']): Promise<User[]>;
    /**
     * Get user statistics grouped by auth method
     */
    static getAuthMethodStats(): Promise<{
        authMethod: string;
        count: number;
    }[]>;
}
//# sourceMappingURL=User.d.ts.map