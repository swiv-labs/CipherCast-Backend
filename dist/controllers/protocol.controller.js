"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolController = void 0;
const cyphercastClient_1 = require("../services/solana/cyphercastClient");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../utils/errorHandler");
class ProtocolController {
    /**
     * Initialize protocol (one-time admin setup)
     */
    static async initializeProtocol(req, res, next) {
        try {
            const { protocolFeeBps } = req.body;
            const signature = await cyphercastClient_1.cyphercastClient.initializeProtocol(protocolFeeBps || 250);
            return (0, response_1.successResponse)(res, 'Protocol initialized successfully', { signature, protocolFeeBps: protocolFeeBps || 250 }, 201);
        }
        catch (error) {
            if (error.message.includes('already in use')) {
                throw new errorHandler_1.AppError('Protocol already initialized', 400);
            }
            next(error);
        }
    }
    /**
     * Get protocol state from blockchain
     */
    static async getProtocolState(req, res, next) {
        try {
            const state = await cyphercastClient_1.cyphercastClient.getProtocolState();
            console.log('Protocol state:', state);
            if (!state) {
                throw new errorHandler_1.AppError('Protocol not initialized', 404);
            }
            return (0, response_1.successResponse)(res, 'Protocol state retrieved', {
                admin: state.admin,
                protocolFeeBps: state.protocolFeeBps,
                totalPoolsCreated: state.totalPoolsCreated.toString(),
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Initialize Arcium computation definitions (one-time setup)
     */
    static async initializeArciumCompDefs(req, res, next) {
        try {
            const results = {
                processBet: null,
                calculateReward: null,
                errors: [],
            };
            // Initialize process_bet comp def
            try {
                const processBetTx = await cyphercastClient_1.cyphercastClient.initProcessBetCompDef();
                results.processBet = processBetTx;
            }
            catch (error) {
                console.error('Process bet comp def initialization failed:', error.message);
                results.errors.push(`Process bet: ${error.message}`);
            }
            // Initialize calculate_reward comp def
            try {
                const calculateRewardTx = await cyphercastClient_1.cyphercastClient.initCalculateRewardCompDef();
                results.calculateReward = calculateRewardTx;
            }
            catch (error) {
                console.error('Calculate reward comp def initialization failed:', error.message);
                results.errors.push(`Calculate reward: ${error.message}`);
            }
            if (results.errors.length === 2) {
                throw new errorHandler_1.AppError('Failed to initialize both computation definitions', 500);
            }
            return (0, response_1.successResponse)(res, results.errors.length === 0
                ? 'Arcium computation definitions initialized successfully'
                : 'Arcium computation definitions partially initialized', results, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Initialize process_bet computation definition only
     */
    static async initProcessBetCompDef(req, res, next) {
        try {
            const signature = await cyphercastClient_1.cyphercastClient.initProcessBetCompDef();
            return (0, response_1.successResponse)(res, 'Process bet computation definition initialized', { signature }, 201);
        }
        catch (error) {
            if (error.message.includes('already in use')) {
                throw new errorHandler_1.AppError('Process bet comp def already initialized', 400);
            }
            next(error);
        }
    }
    /**
     * Initialize calculate_reward computation definition only
     */
    static async initCalculateRewardCompDef(req, res, next) {
        try {
            const signature = await cyphercastClient_1.cyphercastClient.initCalculateRewardCompDef();
            return (0, response_1.successResponse)(res, 'Calculate reward computation definition initialized', { signature }, 201);
        }
        catch (error) {
            if (error.message.includes('already in use')) {
                throw new errorHandler_1.AppError('Calculate reward comp def already initialized', 400);
            }
            next(error);
        }
    }
}
exports.ProtocolController = ProtocolController;
//# sourceMappingURL=protocol.controller.js.map