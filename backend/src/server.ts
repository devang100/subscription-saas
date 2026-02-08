import 'dotenv/config'; // Must be first
import app from './app';
// import dotenv from 'dotenv'; // No longer needed as explicit object
import { PrismaClient } from '@prisma/client';

// dotenv.config(); // Loaded via import

const PORT = process.env.PORT || 4000;

// Initialize Prisma
export const prisma = new PrismaClient();

import { createServer } from 'http';
import { initSocket } from './services/socketService';

// ... (imports)

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        // Create HTTP server from Express app
        const httpServer = createServer(app);

        // Init Socket.io
        initSocket(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
