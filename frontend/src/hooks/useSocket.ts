'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useParams } from 'next/navigation';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const { user } = useAuthStore();
    const params = useParams();
    const orgId = params?.orgId as string;
    const projectId = params?.projectId as string;

    useEffect(() => {
        // Initialize Socket
        // In prod, use actual URL var
        const socketUrl = 'http://localhost:4000';

        if (!socketRef.current) {
            socketRef.current = io(socketUrl);
        }

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected');
            if (user?.id) {
                socket.emit('join_user', user.id);
            }
            if (orgId) {
                socket.emit('join_org', orgId);
            }
            if (projectId) {
                socket.emit('join_project', projectId);
            }
        });

        return () => {
            // We don't necessarily want to disconnect on every route change if we want persistence,
            // but for simple effect cleanup:
            // socket.disconnect();
        };
    }, [user?.id, orgId, projectId]);

    return socketRef.current;
};
