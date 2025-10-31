export interface Pool {
    id: string;
    asset_symbol: string;
    target_price: number;
    final_price?: number;
    end_time: string;
    status: 'active' | 'closed';
    creator: string;
    blockchain_signature: string;
    pool_pubkey: string;
    vault_pubkey: string;
    entry_fee: number;
    max_participants: number;
    poolid: number;
    total_participants: number;
    total_pool_amount: number;
    created_at: string;
}
export declare class PoolModel {
    static create(poolData: {
        asset_symbol: string;
        target_price: number;
        end_time: string;
        creator: string;
        blockchain_signature: string;
        pool_pubkey: string;
        vault_pubkey: string;
        entry_fee: number;
        max_participants: number;
        poolid: number;
    }): Promise<Pool>;
    static findById(id: string): Promise<Pool | null>;
    static findByPoolId(id: string): Promise<Pool | null>;
    static findAll(status?: string): Promise<Pool[]>;
    static findExpiredPools(): Promise<Pool[]>;
    static update(id: string, updates: Partial<Pool>): Promise<Pool>;
    static close(id: string, finalPrice: number): Promise<Pool>;
}
//# sourceMappingURL=Pool.d.ts.map