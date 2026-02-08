import { Router } from 'express';
import {
    createClient,
    getClients,
    updateClient,
    createProject,
    getProjects,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getMyTasks
} from '../controllers/projectController';
import { addComment, getComments, logTime, getTimeLogs } from '../controllers/commentController';
import { protect } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';

const router = Router();

router.use(protect);

// Client Routes
router.post('/organizations/:orgId/clients', requirePermission('org:read'), createClient);
router.get('/organizations/:orgId/clients', requirePermission('org:read'), getClients);
router.get('/organizations/:orgId/my-tasks', requirePermission('org:read'), getMyTasks);
router.patch('/clients/:clientId', requirePermission('org:read'), updateClient);

// Project Routes
router.post('/clients/:clientId/projects', requirePermission('org:read'), createProject);
router.get('/clients/:clientId/projects', requirePermission('org:read'), getProjects);

// Task Routes
router.post('/projects/:projectId/tasks', requirePermission('org:read'), createTask);
router.get('/projects/:projectId/tasks', requirePermission('org:read'), getTasks);
router.patch('/tasks/:taskId', requirePermission('org:read'), updateTask);
router.delete('/tasks/:taskId', requirePermission('org:read'), deleteTask);

// Comments & TimeLogs
router.post('/tasks/:taskId/comments', requirePermission('org:read'), addComment);
router.get('/tasks/:taskId/comments', requirePermission('org:read'), getComments);
router.post('/tasks/:taskId/timelogs', requirePermission('org:read'), logTime);
router.get('/tasks/:taskId/timelogs', requirePermission('org:read'), getTimeLogs);

export default router;
