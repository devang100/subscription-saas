import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for dev
    console.error(err);

    // Prisma unique constraint error
    if (err.code === 'P2002') {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again!';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Your token has expired! Please log in again.';
        error = new AppError(message, 401);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';

    res.status(statusCode).json({
        success: false,
        message,
    });
};
