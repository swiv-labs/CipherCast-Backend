export interface Prediction {
    id: string;
    pool_id: string;
    user_wallet: string;
    predicted_price: number;
    direction: 'up' | 'down';
    amount: number;
    reward?: number;
    status: 'pending' | 'won' | 'lost' | 'claimed';
    created_at: string;
}
export declare class PredictionModel {
    static create(predictionData: {
        pool_id: string;
        user_wallet: string;
        predicted_price: number;
        amount: number;
    }): Promise<Prediction>;
    static findById(id: string): Promise<Prediction | null>;
    static findByUser(userWallet: string): Promise<Prediction[]>;
    static findByPool(poolId: string): Promise<Prediction[]>;
    static update(id: string, updates: Partial<Prediction>): Promise<Prediction>;
    static updateMany(ids: string[], updates: Partial<Prediction>): Promise<void>;
}
//# sourceMappingURL=Prediction.d.ts.map