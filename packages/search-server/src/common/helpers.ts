import { RequestHandler } from "express-serve-static-core";

export const asyncHandler = (fn: RequestHandler) => 
    (req: any, res: any, next: any) => 
        Promise.resolve(fn(req, res, next)).catch(next);
