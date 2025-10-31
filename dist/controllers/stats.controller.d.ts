import { Request, Response, NextFunction } from 'express';
export declare class StatsController {
    /**
     * Get platform statistics
     */
    static getPlatformStats(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get asset statistics
     */
    static getAssetStats(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=stats.controller.d.ts.map