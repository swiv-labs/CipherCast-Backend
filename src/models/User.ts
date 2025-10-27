import { supabase } from '../config/supabaseClient';

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

export class UserModel {
  /**
   * Create a new user with Privy authentication details
   */
  static async create(params: CreateUserParams): Promise<User> {
    const { data, error } = await supabase
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

    if (error) throw error;
    return data;
  }

  /**
   * Find user by wallet address (Privy embedded wallet)
   */
  static async findByWallet(walletAddress: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Find user by Privy user ID (DID)
   */
  static async findByPrivyId(privyUserId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('privy_user_id', privyUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Find user by auth identifier (email or external wallet)
   */
  static async findByAuthIdentifier(authIdentifier: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_identifier', authIdentifier)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Find user by any identifier (wallet, email, or auth_identifier)
   */
  static async findByAnyIdentifier(identifier: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`wallet_address.eq.${identifier},email.eq.${identifier},auth_identifier.eq.${identifier}`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Update user details
   */
  static async update(walletAddress: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(walletAddress: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('wallet_address', walletAddress);

    if (error) throw error;
  }

  /**
   * Get users by auth method
   */
  static async findByAuthMethod(authMethod: User['auth_method']): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_method', authMethod)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get user statistics grouped by auth method
   */
  static async getAuthMethodStats(): Promise<{ authMethod: string; count: number }[]> {
    const { data, error } = await supabase
      .from('users')
      .select('auth_method');

    if (error) throw error;

    const stats = (data || []).reduce((acc: any, user) => {
      acc[user.auth_method] = (acc[user.auth_method] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(stats).map(([authMethod, count]) => ({
      authMethod,
      count: count as number,
    }));
  }
}