import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { AppError } from '../utils/AppError';
import { createSendToken, signToken } from '../utils/token';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Register Request Body:', req.body);
        const { email, password, fullName, orgName } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Ensure 'Owner' role exists
        let ownerRole = await prisma.role.findUnique({ where: { name: 'Owner' } });
        if (!ownerRole) {
            ownerRole = await prisma.role.create({
                data: { name: 'Owner', isSystem: true, description: 'Organization Owner' }
            });
        }

        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    fullName,
                },
            });

            const slug = (orgName || `${fullName || 'User'}'s Org`)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                + '-' + Date.now().toString().slice(-4);

            const org = await tx.organization.create({
                data: {
                    name: orgName || `${fullName || 'User'}'s Org`,
                    slug,
                },
            });

            await tx.membership.create({
                data: {
                    userId: user.id,
                    organizationId: org.id,
                    roleId: ownerRole!.id,
                },
            });

            // Process Pending Invitations
            const invitations = await tx.invitation.findMany({
                where: { email: user.email }
            });

            for (const invite of invitations) {
                // Check Org Limits before accepting
                const targetOrg = await tx.organization.findUnique({
                    where: { id: invite.organizationId },
                    include: { subscription: { include: { plan: true } } }
                });

                if (targetOrg) {
                    const currentMembers = await tx.membership.count({
                        where: { organizationId: invite.organizationId }
                    });
                    const limit = targetOrg.subscription?.plan?.maxUsers || 2;

                    if (currentMembers < limit) {
                        await tx.membership.create({
                            data: {
                                userId: user.id,
                                organizationId: invite.organizationId,
                                roleId: invite.roleId
                            }
                        });

                        // Delete the invitation only if accepted
                        await tx.invitation.delete({ where: { id: invite.id } });
                    }
                    // Else: keep invitation pending? Or delete and notify? 
                    // Keeping it allows manual retry later if slots open up.
                }
            }

            return user;
        });

        createSendToken(result, 201, res);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // Generate tokens
        createSendToken(user, 200, res);

        // Optionally update user with new refreshToken in DB if strict rotation is needed
        // For now, HttpOnly cookie is our storage.
    } catch (error) {
        next(error);
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('refreshToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return next(new AppError('No refresh token provided', 401));
        }

        const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret');

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return next(new AppError('User not found', 401));
        }

        // Issue new Access Token
        const newAccessToken = signToken(user.id, process.env.JWT_SECRET || 'secret', '15m');

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        return next(new AppError('Invalid refresh token', 401));
    }
};
