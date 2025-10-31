"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const predictions_controller_1 = require("../controllers/predictions.controller");
const validator_1 = require("../utils/validator");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
router.post('/', (0, validator_1.validateRequest)(validator_1.createPredictionSchema), (0, errorHandler_1.asyncHandler)(predictions_controller_1.PredictionsController.createPrediction));
router.get('/:userWallet', (0, errorHandler_1.asyncHandler)(predictions_controller_1.PredictionsController.getUserPredictions));
router.post('/:id/claim', (0, validator_1.validateRequest)(validator_1.claimRewardSchema), (0, errorHandler_1.asyncHandler)(predictions_controller_1.PredictionsController.claimReward));
exports.default = router;
//# sourceMappingURL=predictions.routes.js.map