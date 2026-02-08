import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*', // Allow all for dev, restrict in prod
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Join room based on Organization ID (sent via query or auth handshake)
        // For simplicity, we can let client requesting to join a room
        socket.on('join_org', (orgId: string) => {
            console.log(`Socket ${socket.id} joined org: ${orgId}`);
            socket.join(`org:${orgId}`);
        });

        // Join room based on Project ID
        socket.on('join_project', (projectId: string) => {
            console.log(`Socket ${socket.id} joined project: ${projectId}`);
            socket.join(`project:${projectId}`);
        });

        // Join user specific room for personal notifications
        socket.on('join_user', (userId: string) => {
            console.log(`Socket ${socket.id} joined user: ${userId}`);
            socket.join(`user:${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
