
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { AppError } from '../utils/AppError';
import { prisma } from '../server';
import { getIO } from '../services/socketService';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer Instance
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

export const uploadFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        const { taskId, commentId } = req.body;

        // baseUrl for serving
        const fileUrl = `/uploads/${req.file.filename}`;

        const attachment = await prisma.attachment.create({
            data: {
                fileName: req.file.originalname,
                fileUrl: fileUrl,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                uploaderId: req.user.id,
                taskId: taskId || null,
                commentId: commentId || null
            }
        });

        // Socket Emit if related to Task
        if (taskId) {
            try {
                const task = await prisma.task.findUnique({
                    where: { id: taskId },
                    include: {
                        project: { select: { id: true } },
                        assignee: { select: { id: true, fullName: true, email: true } },
                        attachments: true
                    }
                });
                if (task) {
                    getIO().to(`project:${task.project.id}`).emit('task_updated', task);
                }
            } catch (e) {
                console.warn('Socket emit upload failed');
            }
        }

        res.status(201).json({ success: true, data: attachment });
    } catch (error) {
        next(error);
    }
};

export const deleteFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const attachmentId = req.params.id as string;
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId }
        });

        if (!attachment) return next(new AppError('Attachment not found', 404));

        // Delete from DB
        await prisma.attachment.delete({ where: { id: attachmentId } });

        // Socket Emit if it was a task attachment
        if (attachment.taskId) {
            try {
                const task = await prisma.task.findUnique({
                    where: { id: attachment.taskId },
                    include: {
                        project: { select: { id: true } },
                        assignee: { select: { id: true, fullName: true, email: true } },
                        attachments: true
                    }
                });
                if (task) {
                    getIO().to(`project:${task.project.id}`).emit('task_updated', task);
                }
            } catch (e) {
                console.warn('Socket emit delete file failed');
            }
        }

        // Delete from disk
        const filePath = path.join(uploadDir, path.basename(attachment.fileUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ success: true, message: 'File deleted' });
    } catch (error) {
        next(error);
    }
};
