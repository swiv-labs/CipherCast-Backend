"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsController = void 0;
const Pool_1 = require("../models/Pool");
const cyphercastClient_1 = require("../services/solana/cyphercastClient");
const poolFinalization_service_1 = require("../services/solana/poolFinalization.service");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../utils/errorHandler");
const web3_js_1 = require("@solana/web3.js");
const env_1 = require("../config/env");
// Default token mint (should be configured in .env)
const DEFAULT_TOKEN_MINT = new web3_js_1.PublicKey(env_1.env.TOKEN_MINT);
class PoolsController {
    /**
     * Get all pools
     */
    static async getAllPools(req, res, next) {
        try {
            const { status } = req.query;
            const pools = await Pool_1.PoolModel.findAll(status);
            return (0, response_1.successResponse)(res, 'Pools retrieved successfully', pools);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get pool by ID
     */
    static async getPoolById(req, res, next) {
        try {
            const { id } = req.params;
            const pool = await Pool_1.PoolModel.findById(id);
            if (!pool) {
                throw new errorHandler_1.AppError('Pool not found', 404);
            }
            try {
                const onChainPool = await cyphercastClient_1.cyphercastClient.getPool(parseInt(pool.poolid.toString()));
                // console.log('On-chain pool data:', onChainPool);
                if (onChainPool) {
                    pool.total_participants = onChainPool.totalParticipants;
                    pool.total_pool_amount = onChainPool.totalPoolAmount;
                }
            }
            catch (error) {
                console.log('Could not fetch on-chain pool data:', error);
            }
            return (0, response_1.successResponse)(res, 'Pool retrieved successfully', pool);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a new pool (creates on-chain and in database)
     */
    static async createPool(req, res, next) {
        try {
            const { assetSymbol, targetPrice, endTime, creator } = req.body;
            // Validate end time is in the future
            const targetTimestamp = new Date(endTime).getTime() / 1000;
            if (targetTimestamp <= Date.now() / 1000) {
                throw new errorHandler_1.AppError('End time must be in the future', 400);
            }
            // Generate unique pool ID (timestamp-based)
            const poolId = Date.now();
            // Entry fee in lamports (0.1 SOL = 100_000_000 lamports)
            const entryFee = 100000000; // 0.1 SOL
            const maxParticipants = 100;
            console.log(`Creating pool ${poolId} on-chain...`);
            // Create pool on blockchain FIRST
            let blockchainResult;
            try {
                blockchainResult = await cyphercastClient_1.cyphercastClient.createPool({
                    poolId,
                    assetSymbol,
                    entryFee,
                    targetTimestamp: Math.floor(targetTimestamp),
                    maxParticipants,
                    tokenMint: DEFAULT_TOKEN_MINT,
                });
                console.log('Pool created on-chain:', blockchainResult.signature);
            }
            catch (blockchainError) {
                console.error('Blockchain pool creation failed:', blockchainError);
                throw new errorHandler_1.AppError(`Failed to create pool on blockchain: ${blockchainError.message}`, 500);
            }
            // Create pool in database
            const pool = await Pool_1.PoolModel.create({
                asset_symbol: assetSymbol,
                target_price: targetPrice,
                end_time: endTime,
                creator,
                blockchain_signature: blockchainResult.signature,
                pool_pubkey: blockchainResult.poolPubkey,
                vault_pubkey: blockchainResult.vaultPubkey,
                entry_fee: entryFee,
                max_participants: maxParticipants,
                poolid: poolId,
            });
            // Store blockchain references
            const enrichedPool = {
                ...pool,
                poolId,
                blockchain_signature: blockchainResult.signature,
                pool_pubkey: blockchainResult.poolPubkey,
                vault_pubkey: blockchainResult.vaultPubkey,
                entry_fee: entryFee,
                max_participants: maxParticipants,
            };
            return (0, response_1.successResponse)(res, 'Pool created successfully on blockchain and database', enrichedPool, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Close pool manually
     */
    static async closePool(req, res, next) {
        try {
            const { id } = req.params;
            const pool = await Pool_1.PoolModel.findById(id);
            if (!pool) {
                throw new errorHandler_1.AppError('Pool not found', 404);
            }
            if (pool.status === 'closed') {
                throw new errorHandler_1.AppError('Pool already closed', 400);
            }
            // Close on blockchain
            try {
                const poolId = parseInt(pool.poolid.toString());
                await cyphercastClient_1.cyphercastClient.closePool(poolId);
                console.log(`Pool ${poolId} closed on-chain`);
            }
            catch (error) {
                console.error('Failed to close pool on-chain:', error.message);
            }
            // Update database
            const updatedPool = await Pool_1.PoolModel.update(id, { status: 'closed' });
            return (0, response_1.successResponse)(res, 'Pool closed successfully', updatedPool);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Finalize pool with oracle price
     */
    static async finalizePool(req, res, next) {
        try {
            const { id } = req.params;
            const pool = await Pool_1.PoolModel.findById(id);
            if (!pool) {
                throw new errorHandler_1.AppError('Pool not found', 404);
            }
            if (pool.status === 'closed') {
                throw new errorHandler_1.AppError('Pool already finalized', 400);
            }
            if (new Date(pool.end_time) > new Date()) {
                throw new errorHandler_1.AppError('Pool end time has not been reached yet', 400);
            }
            await poolFinalization_service_1.PoolFinalizationService.finalizePool(id);
            const updatedPool = await Pool_1.PoolModel.findById(id);
            return (0, response_1.successResponse)(res, 'Pool finalized successfully', updatedPool);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PoolsController = PoolsController;
//# sourceMappingURL=pools.controller.js.map