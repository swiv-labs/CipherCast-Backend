"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolFinalizationService = void 0;
const Pool_1 = require("../../models/Pool");
const Prediction_1 = require("../../models/Prediction");
const Leaderboard_1 = require("../../models/Leaderboard");
const oracle_service_1 = require("../oracle.service");
const cyphercastClient_1 = require("./cyphercastClient");
class PoolFinalizationService {
    /**
     * Finalize a single pool
     */
    static async finalizePool(poolId) {
        try {
            const pool = await Pool_1.PoolModel.findByPoolId(poolId);
            if (!pool)
                throw new Error('Pool not found');
            if (pool.status === 'closed')
                throw new Error('Pool already closed');
            console.log(`Finalizing pool ${poolId}...`);
            // 1. Fetch final price from oracle
            const finalPrice = await oracle_service_1.OracleService.getCurrentPrice(pool.asset_symbol);
            console.log(`Final price for ${pool.asset_symbol}: ${finalPrice}`);
            // Convert price to u64 format (multiply by 100 for 2 decimal precision)
            const actualPriceU64 = Math.floor(finalPrice * 100);
            // 2. Call Solana contract to finalize
            try {
                const numericPoolId = parseInt(poolId);
                const signature = await cyphercastClient_1.cyphercastClient.finalizePool({
                    poolId: numericPoolId,
                    actualPrice: actualPriceU64,
                });
                console.log(`Pool ${poolId} finalized on-chain:`, signature);
            }
            catch (blockchainError) {
                console.error('Blockchain finalization failed:', blockchainError.message);
                // Continue with database update even if blockchain fails
            }
            // 3. Update pool status in database
            await Pool_1.PoolModel.close(pool.id, finalPrice);
            // 4. Calculate winners and update predictions
            await this.settlePredictions(pool.id, finalPrice, pool.target_price);
            console.log(`Pool ${pool.id} finalized successfully`);
        }
        catch (error) {
            console.error(`Failed to finalize pool ${poolId}:`, error.message);
            throw error;
        }
    }
    /**
     * Settle all predictions for a pool
     */
    static async settlePredictions(poolId, finalPrice, targetPrice) {
        const predictions = await Prediction_1.PredictionModel.findByPool(poolId);
        for (const prediction of predictions) {
            const isWinner = this.checkWinner(prediction.direction, prediction.predicted_price, finalPrice, targetPrice);
            const reward = isWinner ? prediction.amount * 1.8 : 0; // 80% profit for winners
            const status = isWinner ? 'won' : 'lost';
            await Prediction_1.PredictionModel.update(prediction.id, { reward, status });
            await Leaderboard_1.LeaderboardModel.incrementStats(prediction.user_wallet, isWinner, reward);
        }
    }
    /**
     * Determine if prediction is a winner
     */
    static checkWinner(direction, predictedPrice, finalPrice, targetPrice) {
        if (direction === 'up') {
            return finalPrice >= targetPrice;
        }
        else {
            return finalPrice < targetPrice;
        }
    }
}
exports.PoolFinalizationService = PoolFinalizationService;
//# sourceMappingURL=poolFinalization.service.js.map