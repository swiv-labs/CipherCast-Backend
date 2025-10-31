"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("../controllers/leaderboard.controller");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(leaderboard_controller_1.LeaderboardController.getLeaderboard));
router.get('/:walletAddress', (0, errorHandler_1.asyncHandler)(leaderboard_controller_1.LeaderboardController.getUserStats));
exports.default = router;
//# sourceMappingURL=leaderboard.routes.js.map