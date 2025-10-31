"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionsController = void 0;
const Prediction_1 = require("../models/Prediction");
const Pool_1 = require("../models/Pool");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../utils/errorHandler");
class PredictionsController {
    /**
     * Create a new prediction
     */
    static async createPrediction(req, res, next) {
        try {
            const { poolId, userWallet, predictedPrice, direction, amount } = req.body;
            // Validate pool exists and is active
            const pool = await Pool_1.PoolModel.findById(poolId);
            if (!pool) {
                throw new errorHandler_1.AppError('Pool not found', 404);
            }
            if (pool.status !== 'active') {
                throw new errorHandler_1.AppError('Pool is not active', 400);
            }
            if (new Date(pool.end_time) <= new Date()) {
                throw new errorHandler_1.AppError('Pool has expired', 400);
            }
            // Create prediction in database
            const prediction = await Prediction_1.PredictionModel.create({
                pool_id: poolId,
                user_wallet: userWallet,
                predicted_price: predictedPrice,
                // direction,
                amount,
            });
            return (0, response_1.successResponse)(res, 'Prediction placed successfully', prediction, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user predictions
     */
    static async getUserPredictions(req, res, next) {
        try {
            const { userWallet } = req.params;
            const predictions = await Prediction_1.PredictionModel.findByUser(userWallet);
            return (0, response_1.successResponse)(res, 'Predictions retrieved successfully', predictions);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Claim reward
     */
    static async claimReward(req, res, next) {
        try {
            const { id } = req.params;
            const { userWallet } = req.body;
            const prediction = await Prediction_1.PredictionModel.findById(id);
            if (!prediction) {
                throw new errorHandler_1.AppError('Prediction not found', 404);
            }
            if (prediction.user_wallet !== userWallet) {
                throw new errorHandler_1.AppError('Unauthorized', 403);
            }
            if (prediction.status !== 'won') {
                throw new errorHandler_1.AppError('Prediction did not win', 400);
            }
            if (prediction.status === 'claimed') {
                throw new errorHandler_1.AppError('Reward already claimed', 400);
            }
            // Update prediction status
            const updatedPrediction = await Prediction_1.PredictionModel.update(id, {
                status: 'claimed',
            });
            return (0, response_1.successResponse)(res, 'Reward claimed successfully', updatedPrediction);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PredictionsController = PredictionsController;
//# sourceMappingURL=predictions.controller.js.map