"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPoolFinalizationJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Pool_1 = require("../models/Pool");
const poolFinalization_service_1 = require("../services/solana/poolFinalization.service");
const startPoolFinalizationJob = () => {
    // Run every minute
    node_cron_1.default.schedule('* * * * *', async () => {
        try {
            console.log('Running pool finalization job...');
            const expiredPools = await Pool_1.PoolModel.findExpiredPools();
            if (expiredPools.length === 0) {
                console.log('No expired pools to finalize');
                return;
            }
            console.log(`Found ${expiredPools.length} expired pool(s)`);
            for (const pool of expiredPools) {
                try {
                    await poolFinalization_service_1.PoolFinalizationService.finalizePool(pool.poolid.toString());
                }
                catch (error) {
                    console.error(`Error finalizing pool ${pool.id}:`, error.message);
                }
            }
        }
        catch (error) {
            console.error('Pool finalization job error:', error.message);
        }
    });
    console.log('Pool finalization job started (runs every minute)');
};
exports.startPoolFinalizationJob = startPoolFinalizationJob;
//# sourceMappingURL=finalizePools.job.js.map