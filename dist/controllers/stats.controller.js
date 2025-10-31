"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const supabaseClient_1 = require("../config/supabaseClient");
const response_1 = require("../utils/response");
class StatsController {
    /**
     * Get platform statistics
     */
    static async getPlatformStats(req, res, next) {
        try {
            // Total pools
            const { count: totalPools } = await supabaseClient_1.supabase
                .from('pools')
                .select('*', { count: 'exact', head: true });
            // Active pools
            const { count: activePools } = await supabaseClient_1.supabase
                .from('pools')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            // Total volume
            const { data: volumeData } = await supabaseClient_1.supabase
                .from('predictions')
                .select('amount');
            const totalVolume = volumeData?.reduce((sum, p) => sum + p.amount, 0) || 0;
            // Active users
            const { count: activeUsers } = await supabaseClient_1.supabase
                .from('users')
                .select('*', { count: 'exact', head: true });
            // Total predictions
            const { count: totalPredictions } = await supabaseClient_1.supabase
                .from('predictions')
                .select('*', { count: 'exact', head: true });
            const stats = {
                totalPools: totalPools || 0,
                activePools: activePools || 0,
                totalVolume,
                activeUsers: activeUsers || 0,
                totalPredictions: totalPredictions || 0,
            };
            return (0, response_1.successResponse)(res, 'Platform stats retrieved successfully', stats);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get asset statistics
     */
    static async getAssetStats(req, res, next) {
        try {
            const { data: pools } = await supabaseClient_1.supabase
                .from('pools')
                .select('asset_symbol, id');
            const assetStats = {};
            for (const pool of pools || []) {
                const symbol = pool.asset_symbol;
                if (!assetStats[symbol]) {
                    assetStats[symbol] = {
                        assetSymbol: symbol,
                        totalPools: 0,
                        totalVolume: 0,
                        totalPredictions: 0,
                    };
                }
                assetStats[symbol].totalPools++;
                const { data: predictions } = await supabaseClient_1.supabase
                    .from('predictions')
                    .select('amount')
                    .eq('pool_id', pool.id);
                const volume = predictions?.reduce((sum, p) => sum + p.amount, 0) || 0;
                assetStats[symbol].totalVolume += volume;
                assetStats[symbol].totalPredictions += predictions?.length || 0;
            }
            return (0, response_1.successResponse)(res, 'Asset stats retrieved successfully', Object.values(assetStats));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StatsController = StatsController;
//# sourceMappingURL=stats.controller.js.map