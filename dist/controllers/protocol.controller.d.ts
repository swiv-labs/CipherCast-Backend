import { Request, Response, NextFunction } from 'express';
export declare class ProtocolController {
    /**
     * Initialize protocol (one-time admin setup)
     */
    static initializeProtocol(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Get protocol state from blockchain
     */
    static getProtocolState(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Initialize Arcium computation definitions (one-time setup)
     */
    static initializeArciumCompDefs(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Initialize process_bet computation definition only
     */
    static initProcessBetCompDef(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Initialize calculate_reward computation definition only
     */
    static initCalculateRewardCompDef(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=protocol.controller.d.ts.map