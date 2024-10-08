import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../index';
import { testDataSource } from '../setup';
import { User } from '../../entity/User';

let app: Express;

describe('User Routes', () => {
    beforeAll(async () => {
        app = createApp(testDataSource);
    });

    beforeEach(async () => {
        await testDataSource.getRepository(User).clear();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should not register a user with an existing username', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'existinguser',
                email: 'new@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username or email already exists');
    });

    it('should not register a user with an existing email', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'user1',
                email: 'existing@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'user2',
                email: 'existing@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username or email already exists');
    });

    it('should not register a user with invalid input', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'invaliduser',
                email: 'invalid-email',
                password: '123'
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should login a user', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'password123'
            });

        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body.token).toBeDefined();
    });

    it('should not login with incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: 'nonexistentuser',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid username or password');
    });

    it('should get user info for authenticated user', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'infouser',
                email: 'info@example.com',
                password: 'password123'
            });

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'infouser',
                password: 'password123'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('infouser');
        expect(response.body.email).toBe('info@example.com');
        expect(response.body.password_hash).toBeUndefined();
    });

    it('should not access protected route without authentication', async () => {
        const response = await request(app).get('/api/users/me');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Authentication required');
    });

    it('should update user information', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'updateuser',
                email: 'update@example.com',
                password: 'password123'
            });

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'updateuser',
                password: 'password123'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'newemail@example.com'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User information updated successfully');
        expect(response.body.user.email).toBe('newemail@example.com');
    });

    it('should delete user account', async () => {
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'deleteuser',
                email: 'delete@example.com',
                password: 'password123'
            });

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'deleteuser',
                password: 'password123'
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User account deleted successfully');

        const loginAttempt = await request(app)
            .post('/api/users/login')
            .send({
                username: 'deleteuser',
                password: 'password123'
            });

        expect(loginAttempt.status).toBe(400);
        expect(loginAttempt.body.message).toBe('Invalid username or password');
    });
});