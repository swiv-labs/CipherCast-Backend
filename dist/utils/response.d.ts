import { Response } from 'express';
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    error?: any;
}
export declare const successResponse: <T>(res: Response, message: string, data?: T, statusCode?: number) => Response;
export declare const errorResponse: (res: Response, message: string, error?: any, statusCode?: number) => Response;
//# sourceMappingURL=response.d.ts.map