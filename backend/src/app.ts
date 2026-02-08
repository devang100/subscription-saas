import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth.routes';
import orgRoutes from './routes/org.routes';
import userRoutes from './routes/user.routes';
import subRoutes from './routes/subscription.routes';
import webhookRoutes from './routes/webhook.routes';
import projectRoutes from './routes/project.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import portalRoutes from './routes/portal.routes';
import reportRoutes from './routes/report.routes';
import contactRoutes from './routes/contact.routes';
import newsletterRoutes from './routes/newsletter.routes';
import path from 'path';

const app = express();

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow serving images
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Webhooks need raw body
app.use('/api/webhooks', webhookRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
import { apiLimiter } from './middlewares/rateLimiter';
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', projectRoutes); // Clients, Projects, Tasks
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Error Handling
app.use(errorHandler);

export default app;
