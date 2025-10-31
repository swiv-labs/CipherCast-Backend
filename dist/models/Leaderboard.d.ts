export interface LeaderboardEntry {
    id: string;
    user_wallet: string;
    total_predictions: number;
    wins: number;
    losses: number;
    earnings: number;
}
export declare class LeaderboardModel {
    static findOrCreate(userWallet: string): Promise<LeaderboardEntry>;
    static update(userWallet: string, updates: Partial<LeaderboardEntry>): Promise<LeaderboardEntry>;
    static incrementStats(userWallet: string, won: boolean, reward: number): Promise<void>;
    static getTopUsers(limit?: number): Promise<LeaderboardEntry[]>;
    static findByWallet(userWallet: string): Promise<LeaderboardEntry | null>;
}
//# sourceMappingURL=Leaderboard.d.ts.map