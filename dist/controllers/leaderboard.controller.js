"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardController = void 0;
const leaderboard_service_1 = require("../services/leaderboard.service");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../utils/errorHandler");
class LeaderboardController {
    /**
     * Get leaderboard
     */
    static async getLeaderboard(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const leaderboard = await leaderboard_service_1.LeaderboardService.getTopUsers(limit);
            const enriched = leaderboard.map(entry => ({
                ...entry,
                winRate: leaderboard_service_1.LeaderboardService.calculateWinRate(entry.wins, entry.total_predictions),
            }));
            return (0, response_1.successResponse)(res, 'Leaderboard retrieved successfully', enriched);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user leaderboard stats
     */
    static async getUserStats(req, res, next) {
        try {
            const { walletAddress } = req.params;
            const stats = await leaderboard_service_1.LeaderboardService.getUserStats(walletAddress);
            if (!stats) {
                throw new errorHandler_1.AppError('User stats not found', 404);
            }
            const enriched = {
                ...stats,
                winRate: leaderboard_service_1.LeaderboardService.calculateWinRate(stats.wins, stats.total_predictions),
            };
            return (0, response_1.successResponse)(res, 'User stats retrieved successfully', enriched);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LeaderboardController = LeaderboardController;
//# sourceMappingURL=leaderboard.controller.js.map