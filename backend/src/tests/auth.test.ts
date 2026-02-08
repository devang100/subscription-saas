import request from 'supertest';
import app from '../app';
import { prisma } from '../server';

describe('Auth API', () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return 400 if email/password missing', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Please provide email and password');
    });

    it('should return 401 for incorrect credentials', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Incorrect email or password');
    });
});
