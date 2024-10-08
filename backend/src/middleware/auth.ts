import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        
        (req as any).userId = user.id;
        next();
    });
};

// Extend Express Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}