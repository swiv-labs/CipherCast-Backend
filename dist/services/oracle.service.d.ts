export declare class OracleService {
    /**
     * Fetch current price from Binance
     */
    static getPriceFromBinance(assetSymbol: string): Promise<number>;
    /**
     * Fetch current price from CoinGecko (fallback)
     */
    static getPriceFromCoinGecko(assetSymbol: string): Promise<number>;
    /**
     * Get current price with fallback logic
     */
    static getCurrentPrice(assetSymbol: string): Promise<number>;
}
//# sourceMappingURL=oracle.service.d.ts.map