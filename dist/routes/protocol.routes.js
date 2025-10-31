"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../utils/errorHandler");
const protocol_controller_1 = require("../controllers/protocol.controller");
const router = (0, express_1.Router)();
router.post('/initialize', (0, errorHandler_1.asyncHandler)(protocol_controller_1.ProtocolController.initializeProtocol));
router.get('/state', (0, errorHandler_1.asyncHandler)(protocol_controller_1.ProtocolController.getProtocolState));
router.post('/arcium/init-all', (0, errorHandler_1.asyncHandler)(protocol_controller_1.ProtocolController.initializeArciumCompDefs));
router.post('/arcium/init-process-bet', (0, errorHandler_1.asyncHandler)(protocol_controller_1.ProtocolController.initProcessBetCompDef));
router.post('/arcium/init-calculate-reward', (0, errorHandler_1.asyncHandler)(protocol_controller_1.ProtocolController.initCalculateRewardCompDef));
exports.default = router;
//# sourceMappingURL=protocol.routes.js.map