import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const signToken = (id: string, secret: string, expiresIn: string | number) => {
    return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

export const createSendToken = (user: any, statusCode: number, res: Response) => {
    const accessToken = signToken(user.id, process.env.JWT_SECRET || 'secret', '15m');
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET || 'refreshSecret', '7d');

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const, // or 'lax'
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Remove password from output
    user.passwordHash = undefined;
    user.refreshToken = undefined;

    res.status(statusCode).json({
        success: true,
        accessToken,
        data: {
            user,
        },
    });
};
