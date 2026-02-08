import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
    user?: any; // strict typing would be User
    file?: any; // Add for uploads (Multer)
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Check if user still exists
        const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // Grant Access
        req.user = currentUser;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Token expired', 401));
        }
        return next(new AppError('Not authorized', 401));
    }
};
