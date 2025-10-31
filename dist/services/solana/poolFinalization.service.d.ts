export declare class PoolFinalizationService {
    /**
     * Finalize a single pool
     */
    static finalizePool(poolId: string): Promise<void>;
    /**
     * Settle all predictions for a pool
     */
    private static settlePredictions;
    /**
     * Determine if prediction is a winner
     */
    private static checkWinner;
}
//# sourceMappingURL=poolFinalization.service.d.ts.map