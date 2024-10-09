import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { AppDataSource } from '../index';

export interface AuthRequest extends Request {
    user?: User;
}

interface JwtPayload {
    id: number;
    isAdmin: boolean;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.sendStatus(403);
        }

        // Ensure the isAdmin flag from the token matches the user's current status
        if (user.isAdmin !== decoded.isAdmin) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error in authenticateToken:', err);
        return res.sendStatus(403);
    }
};

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}