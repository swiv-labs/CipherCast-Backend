"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
class UserModel {
    /**
     * Create a new user with Privy authentication details
     */
    static async create(params) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .insert([{
                wallet_address: params.walletAddress,
                auth_method: params.authMethod,
                auth_identifier: params.authIdentifier,
                privy_user_id: params.privyUserId,
                username: params.username,
                email: params.email,
                avatar_url: params.avatarUrl,
                is_email_verified: params.isEmailVerified || false,
            }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    /**
     * Find user by wallet address (Privy embedded wallet)
     */
    static async findByWallet(walletAddress) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    /**
     * Find user by Privy user ID (DID)
     */
    static async findByPrivyId(privyUserId) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('privy_user_id', privyUserId)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    /**
     * Find user by auth identifier (email or external wallet)
     */
    static async findByAuthIdentifier(authIdentifier) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('auth_identifier', authIdentifier)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    /**
     * Find user by any identifier (wallet, email, or auth_identifier)
     */
    static async findByAnyIdentifier(identifier) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .or(`wallet_address.eq.${identifier},email.eq.${identifier},auth_identifier.eq.${identifier}`)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    /**
     * Update user details
     */
    static async update(walletAddress, updates) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .update(updates)
            .eq('wallet_address', walletAddress)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    /**
     * Update last login timestamp
     */
    static async updateLastLogin(walletAddress) {
        const { error } = await supabaseClient_1.supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('wallet_address', walletAddress);
        if (error)
            throw error;
    }
    /**
     * Get users by auth method
     */
    static async findByAuthMethod(authMethod) {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('*')
            .eq('auth_method', authMethod)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    /**
     * Get user statistics grouped by auth method
     */
    static async getAuthMethodStats() {
        const { data, error } = await supabaseClient_1.supabase
            .from('users')
            .select('auth_method');
        if (error)
            throw error;
        const stats = (data || []).reduce((acc, user) => {
            acc[user.auth_method] = (acc[user.auth_method] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(stats).map(([authMethod, count]) => ({
            authMethod,
            count: count,
        }));
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map