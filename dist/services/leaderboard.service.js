"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const Leaderboard_1 = require("../models/Leaderboard");
class LeaderboardService {
    static async getTopUsers(limit = 10) {
        return await Leaderboard_1.LeaderboardModel.getTopUsers(limit);
    }
    static async getUserStats(userWallet) {
        return await Leaderboard_1.LeaderboardModel.findByWallet(userWallet);
    }
    static calculateWinRate(wins, totalPredictions) {
        if (totalPredictions === 0)
            return 0;
        return (wins / totalPredictions) * 100;
    }
}
exports.LeaderboardService = LeaderboardService;
//# sourceMappingURL=leaderboard.service.js.map