import { Request, Response, NextFunction } from 'express';
export declare class LeaderboardController {
    /**
     * Get leaderboard
     */
    static getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get user leaderboard stats
     */
    static getUserStats(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=leaderboard.controller.d.ts.map