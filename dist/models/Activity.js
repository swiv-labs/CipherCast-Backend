"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
class ActivityModel {
    static async create(activityData) {
        const { data, error } = await supabaseClient_1.supabase
            .from('activity')
            .insert([activityData])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    static async findByUser(userWallet, limit = 50) {
        const { data, error } = await supabaseClient_1.supabase
            .from('activity')
            .select('*')
            .eq('user_wallet', userWallet)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error)
            throw error;
        return data || [];
    }
}
exports.ActivityModel = ActivityModel;
//# sourceMappingURL=Activity.js.map