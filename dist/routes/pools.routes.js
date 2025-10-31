"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pools_controller_1 = require("../controllers/pools.controller");
const validator_1 = require("../utils/validator");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
router.get('/', (0, errorHandler_1.asyncHandler)(pools_controller_1.PoolsController.getAllPools));
router.get('/:id', (0, errorHandler_1.asyncHandler)(pools_controller_1.PoolsController.getPoolById));
router.post('/create', (0, validator_1.validateRequest)(validator_1.createPoolSchema), (0, errorHandler_1.asyncHandler)(pools_controller_1.PoolsController.createPool));
router.post('/:id/close', (0, validator_1.validateRequest)(validator_1.finalizePoolSchema), (0, errorHandler_1.asyncHandler)(pools_controller_1.PoolsController.closePool));
router.post('/:id/finalize', (0, errorHandler_1.asyncHandler)(pools_controller_1.PoolsController.finalizePool));
exports.default = router;
//# sourceMappingURL=pools.routes.js.map