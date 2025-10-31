"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionModel = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
class PredictionModel {
    static async create(predictionData) {
        const { data, error } = await supabaseClient_1.supabase
            .from('predictions')
            .insert([{ ...predictionData, status: 'pending' }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async findById(id) {
        const { data, error } = await supabaseClient_1.supabase
            .from('predictions')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    static async findByUser(userWallet) {
        const { data, error } = await supabaseClient_1.supabase
            .from('predictions')
            .select('*, pools(*)')
            .eq('user_wallet', userWallet)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    static async findByPool(poolId) {
        const { data, error } = await supabaseClient_1.supabase
            .from('predictions')
            .select('*')
            .eq('pool_id', poolId);
        if (error)
            throw error;
        return data || [];
    }
    static async update(id, updates) {
        const { data, error } = await supabaseClient_1.supabase
            .from('predictions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async updateMany(ids, updates) {
        const { error } = await supabaseClient_1.supabase
            .from('predictions')
            .update(updates)
            .in('id', ids);
        if (error)
            throw error;
    }
}
exports.PredictionModel = PredictionModel;
//# sourceMappingURL=Prediction.js.map