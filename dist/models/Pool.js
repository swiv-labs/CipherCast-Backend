"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolModel = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
class PoolModel {
    static async create(poolData) {
        const { data, error } = await supabaseClient_1.supabase
            .from('pools')
            .insert([{ ...poolData, status: 'active' }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async findById(id) {
        const { data, error } = await supabaseClient_1.supabase
            .from('pools')
            .select('*')
            .eq('id', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    static async findByPoolId(id) {
        const { data, error } = await supabaseClient_1.supabase
            .from('pools')
            .select('*')
            .eq('poolid', id)
            .single();
        if (error && error.code !== 'PGRST116')
            throw error;
        return data;
    }
    static async findAll(status) {
        let query = supabaseClient_1.supabase.from('pools').select('*').order('created_at', { ascending: false });
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data || [];
    }
    static async findExpiredPools() {
        const { data, error } = await supabaseClient_1.supabase
            .from('pools')
            .select('*')
            .eq('status', 'active')
            .lt('end_time', new Date().toISOString());
        if (error)
            throw error;
        return data || [];
    }
    static async update(id, updates) {
        const { data, error } = await supabaseClient_1.supabase
            .from('pools')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async close(id, finalPrice) {
        return this.update(id, { status: 'closed', final_price: finalPrice });
    }
}
exports.PoolModel = PoolModel;
//# sourceMappingURL=Pool.js.map