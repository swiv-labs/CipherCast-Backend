"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
router.get('/platform', (0, errorHandler_1.asyncHandler)(stats_controller_1.StatsController.getPlatformStats));
router.get('/assets', (0, errorHandler_1.asyncHandler)(stats_controller_1.StatsController.getAssetStats));
exports.default = router;
//# sourceMappingURL=stats.routes.js.map