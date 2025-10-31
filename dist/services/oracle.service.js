"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const constants_1 = require("../utils/constants");
class OracleService {
    /**
     * Fetch current price from Binance
     */
    static async getPriceFromBinance(assetSymbol) {
        try {
            const symbol = constants_1.BINANCE_SYMBOL_MAP[assetSymbol];
            if (!symbol)
                throw new Error(`Unsupported asset: ${assetSymbol}`);
            const response = await axios_1.default.get(`${env_1.env.BINANCE_API_URL}/ticker/price`, {
                params: { symbol },
            });
            return parseFloat(response.data.price);
        }
        catch (error) {
            console.error('Binance API error:', error.message);
            throw new Error(`Failed to fetch price from Binance: ${error.message}`);
        }
    }
    /**
     * Fetch current price from CoinGecko (fallback)
     */
    static async getPriceFromCoinGecko(assetSymbol) {
        try {
            const coinId = constants_1.COINGECKO_ID_MAP[assetSymbol];
            if (!coinId)
                throw new Error(`Unsupported asset: ${assetSymbol}`);
            const response = await axios_1.default.get(`${env_1.env.COINGECKO_API_URL}/simple/price`, {
                params: {
                    ids: coinId,
                    vs_currencies: 'usd',
                },
            });
            return response.data[coinId].usd;
        }
        catch (error) {
            console.error('CoinGecko API error:', error.message);
            throw new Error(`Failed to fetch price from CoinGecko: ${error.message}`);
        }
    }
    /**
     * Get current price with fallback logic
     */
    static async getCurrentPrice(assetSymbol) {
        try {
            return await this.getPriceFromBinance(assetSymbol);
        }
        catch (error) {
            console.log('Binance failed, trying CoinGecko...');
            return await this.getPriceFromCoinGecko(assetSymbol);
        }
    }
}
exports.OracleService = OracleService;
//# sourceMappingURL=oracle.service.js.map