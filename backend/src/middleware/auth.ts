import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export interface AuthRequest extends Request {
    user?: User;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        
        req.user = user;
        next();
    });
};

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}