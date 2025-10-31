"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardModel = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
class LeaderboardModel {
    static async findOrCreate(userWallet) {
        let { data, error } = await supabaseClient_1.supabase
            .from('leaderboard')
            .select('*')
            .eq('user_wallet', userWallet)
            .single();
        if (error && error.code === 'PGRST116') {
            const { data: newData, error: insertError } = await supabaseClient_1.supabase
                .from('leaderboard')
                .insert([{
                    user_wallet: userWallet,
                    total_predictions: 0,
                    wins: 0,
                    losses: 0,
                    earnings: 0,
                }])
                .select()
                .single();
            if (insertError)
                throw insertError;
            return newData;
        }
        if (error)
            throw error;
        return data;
    }
    static async update(userWallet, updates) {
        const { data, error } = await supabaseClient_1.supabase
            .from('leaderboard')
            .update(updates)
            .eq('user_wallet', userWallet)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async incrementStats(userWallet, won, reward) {
        const entry = await this.findOrCreate(userWallet);
        await this.update(userWallet, {
            total_predictions: entry.total_predictions + 1,
            wins: won ? entry.wins + 1 : entry.wins,
            losses: won ? entry.losses : entry.losses + 1,
            earnings: entry.earnings + reward,
        });
    }
    static async getTopUsers(limit = 10) {
        const { data, error } = await supabaseClient_1.supabase
            .from('leaderboard')
            .select('*')
            .order('earnings', { ascending: false })
            .limit(limit);
        if (error)
            throw error;
        return data || [];
    }
    static async findByWallet(userWallet) {
        const { data, error } = await supabaseClient_1.supabase
            .from('leaderboard')
            .select('*')
            .eq('user_wallet', userWallet)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
}
exports.LeaderboardModel = LeaderboardModel;
//# sourceMappingURL=Leaderboard.js.map