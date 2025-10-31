import { PublicKey } from '@solana/web3.js';
export declare class CypherCastClient {
    private program;
    private provider;
    private authority;
    constructor();
    private getProtocolStatePDA;
    /**
     * Derive pool PDA
     */
    private getPoolPDA;
    /**
     * Derive pool vault PDA
     */
    private getPoolVaultPDA;
    /**
     * Derive bet PDA
     */
    private getBetPDA;
    /**
     * Initialize the protocol (one-time setup)
     */
    initializeProtocol(protocolFeeBps?: number): Promise<string>;
    /**
     * Create a new prediction pool on-chain
     */
    createPool(params: {
        poolId: number;
        assetSymbol: string;
        entryFee: number;
        targetTimestamp: number;
        maxParticipants: number;
        tokenMint: PublicKey;
    }): Promise<{
        signature: string;
        poolPubkey: string;
        vaultPubkey: string;
    }>;
    /**
     * Fetch pool data from blockchain
     */
    getPool(poolId: number): Promise<any>;
    /**
     * Finalize pool with oracle price
     */
    finalizePool(params: {
        poolId: number;
        actualPrice: number;
    }): Promise<string>;
    /**
     * Close pool (emergency)
     */
    closePool(poolId: number): Promise<string>;
    /**
     * Get protocol state
     */
    getProtocolState(): Promise<any>;
    /**
     * Initialize process_bet computation definition (one-time setup)
     */
    initProcessBetCompDef(): Promise<string>;
    /**
     * Initialize calculate_reward computation definition (one-time setup)
     */
    initCalculateRewardCompDef(): Promise<string>;
    /**
     * Derive computation definition PDA
     */
    private getCompDefPDA;
    /**
     * Helper: Encrypt prediction price (for client-side use)
     * This is an example - in production, encryption happens client-side
     */
    encryptPrediction(predictedPrice: number, userSecretKey: Uint8Array): {
        ciphertext: Uint8Array;
        publicKey: Uint8Array;
        nonce: bigint;
    };
}
export declare const cyphercastClient: CypherCastClient;
//# sourceMappingURL=cyphercastClient.d.ts.map