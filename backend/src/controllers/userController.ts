import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { fullName, password } = req.body;

        const dataToUpdate: any = {};
        if (fullName) dataToUpdate.fullName = fullName;
        if (password) {
            dataToUpdate.passwordHash = await bcrypt.hash(password, 12);
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: dataToUpdate
        });

        // Don't send password hash back
        user.passwordHash = '';

        res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};
