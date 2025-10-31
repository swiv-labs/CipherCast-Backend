export interface Activity {
    id: string;
    user_wallet: string;
    type: string;
    description: string;
    metadata?: any;
    created_at: string;
}
export declare class ActivityModel {
    static create(activityData: {
        user_wallet: string;
        type: string;
        description: string;
        metadata?: any;
    }): Promise<Activity>;
    static findByUser(userWallet: string, limit?: number): Promise<Activity[]>;
}
//# sourceMappingURL=Activity.d.ts.map