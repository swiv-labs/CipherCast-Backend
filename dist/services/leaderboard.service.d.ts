import { LeaderboardEntry } from '../models/Leaderboard';
export declare class LeaderboardService {
    static getTopUsers(limit?: number): Promise<LeaderboardEntry[]>;
    static getUserStats(userWallet: string): Promise<LeaderboardEntry | null>;
    static calculateWinRate(wins: number, totalPredictions: number): number;
}
//# sourceMappingURL=leaderboard.service.d.ts.map