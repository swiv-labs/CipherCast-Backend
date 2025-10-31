"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const finalizePools_job_1 = require("./jobs/finalizePools.job");
const startServer = () => {
    try {
        // Start cron jobs
        (0, finalizePools_job_1.startPoolFinalizationJob)();
        // Start server
        app_1.default.listen(env_1.env.PORT, () => {
            console.log('========================================');
            console.log('CypherCast Backend Server Started');
            console.log('========================================');
            console.log(`Environment: ${env_1.env.NODE_ENV}`);
            console.log(`Port: ${env_1.env.PORT}`);
            console.log(`Solana Network: ${env_1.env.SOLANA_NETWORK}`);
            console.log(`API URL: http://localhost:${env_1.env.PORT}`);
            console.log('========================================');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map