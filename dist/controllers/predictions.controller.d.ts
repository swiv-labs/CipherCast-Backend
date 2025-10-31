import { Request, Response, NextFunction } from 'express';
export declare class PredictionsController {
    /**
     * Create a new prediction
     */
    static createPrediction(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get user predictions
     */
    static getUserPredictions(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Claim reward
     */
    static claimReward(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=predictions.controller.d.ts.map