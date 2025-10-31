"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./utils/errorHandler");
const response_1 = require("./utils/response");
// Import routes
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const pools_routes_1 = __importDefault(require("./routes/pools.routes"));
const predictions_routes_1 = __importDefault(require("./routes/predictions.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const protocol_routes_1 = __importDefault(require("./routes/protocol.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    (0, response_1.successResponse)(res, 'CypherCast API is running', {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// API Routes
app.use('/api/protocol', protocol_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/pools', pools_routes_1.default);
app.use('/api/predictions', predictions_routes_1.default);
app.use('/api/leaderboard', leaderboard_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
    });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map