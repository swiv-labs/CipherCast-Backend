import { Request, Response, NextFunction } from 'express';
export declare class PoolsController {
    /**
     * Get all pools
     */
    static getAllPools(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get pool by ID
     */
    static getPoolById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Create a new pool (creates on-chain and in database)
     */
    static createPool(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Close pool manually
     */
    static closePool(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Finalize pool with oracle price
     */
    static finalizePool(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=pools.controller.d.ts.map