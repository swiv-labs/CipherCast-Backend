"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
exports.env = {
    PORT: parseInt(getEnv('PORT', '5000'), 10),
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    SUPABASE_URL: getEnv('SUPABASE_URL'),
    SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
    SOLANA_RPC_URL: getEnv('SOLANA_RPC_URL'),
    SOLANA_NETWORK: getEnv('SOLANA_NETWORK', 'devnet'),
    PROGRAM_ID: getEnv('PROGRAM_ID'),
    AUTHORITY_KEYPAIR_PATH: getEnv('AUTHORITY_KEYPAIR_PATH'),
    TOKEN_MINT: getEnv('TOKEN_MINT', 'So11111111111111111111111111111111111111112'),
    BINANCE_API_KEY: getEnv('BINANCE_API_KEY', ''),
    BINANCE_API_URL: getEnv('BINANCE_API_URL', 'https://api.binance.com/api/v3'),
    COINGECKO_API_URL: getEnv('COINGECKO_API_URL', 'https://api.coingecko.com/api/v3'),
    CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:3000'),
};
//# sourceMappingURL=env.js.map