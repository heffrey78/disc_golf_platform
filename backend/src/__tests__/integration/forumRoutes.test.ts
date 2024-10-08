import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../index';
import { testDataSource } from '../setup';
import { User } from '../../entity/User';
import { Category } from '../../entity/Category';
import { Subforum } from '../../entity/Subforum';
import { Thread } from '../../entity/Thread';
import { Post } from '../../entity/Post';
import jwt from 'jsonwebtoken';

let app: Express;
let authToken: string;
let adminAuthToken: string;

describe('Forum Routes', () => {
    beforeAll(async () => {
        app = createApp(testDataSource);
        await testDataSource.initialize();
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.synchronize(true);
        
        // Create a test user
        const userRepository = testDataSource.getRepository(User);
        const user = userRepository.create({
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashedpassword',
            isAdmin: false
        });
        await userRepository.save(user);

        // Create an admin user
        const adminUser = userRepository.create({
            username: 'adminuser',
            email: 'admin@example.com',
            password_hash: 'hashedpassword',
            isAdmin: true
        });
        await userRepository.save(adminUser);

        // Generate auth tokens
        authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key');
        adminAuthToken = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET || 'your-secret-key');
    });

    describe('Category operations', () => {
        it('should create a new category (admin only)', async () => {
            const response = await request(app)
                .post('/api/forum/categories')
                .set('Authorization', `Bearer ${adminAuthToken}`)
                .send({
                    name: 'Test Category',
                    description: 'This is a test category'
                });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Test Category');
            expect(response.body.description).toBe('This is a test category');
        });

        it('should not allow non-admin users to create categories', async () => {
            const response = await request(app)
                .post('/api/forum/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Category',
                    description: 'This is a test category'
                });

            expect(response.status).toBe(403);
        });

        it('should list all categories with pagination', async () => {
            const categoryRepository = testDataSource.getRepository(Category);
            for (let i = 0; i < 15; i++) {
                await categoryRepository.save({
                    name: `Test Category ${i}`,
                    description: `This is test category ${i}`
                });
            }

            const response = await request(app)
                .get('/api/forum/categories?page=2&limit=10');

            expect(response.status).toBe(200);
            expect(response.body.categories.length).toBe(5);
            expect(response.body.currentPage).toBe(2);
            expect(response.body.totalPages).toBe(2);
            expect(response.body.totalItems).toBe(15);
        });
    });

    describe('Subforum operations', () => {
        let categoryId: number;

        beforeEach(async () => {
            const categoryRepository = testDataSource.getRepository(Category);
            const category = categoryRepository.create({
                name: 'Test Category',
                description: 'This is a test category'
            });
            const savedCategory = await categoryRepository.save(category);
            categoryId = savedCategory.id;
        });

        it('should create a new subforum', async () => {
            const response = await request(app)
                .post('/api/forum/subforums')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'Test Subforum',
                    description: 'This is a test subforum',
                    categoryId: categoryId
                });

            expect(response.status).toBe(201);
            expect(response.body.name).toBe('Test Subforum');
            expect(response.body.description).toBe('This is a test subforum');
        });

        it('should get a subforum with pagination', async () => {
            const subforumRepository = testDataSource.getRepository(Subforum);
            const subforum = await subforumRepository.save({
                name: 'Test Subforum',
                description: 'This is a test subforum',
                category: { id: categoryId }
            });

            const threadRepository = testDataSource.getRepository(Thread);
            for (let i = 0; i < 15; i++) {
                await threadRepository.save({
                    title: `Test Thread ${i}`,
                    subforum: subforum,
                    author: { id: 1 }
                });
            }

            const response = await request(app)
                .get(`/api/forum/subforums/${subforum.id}?page=2&limit=10`);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Test Subforum');
            expect(response.body.threads.length).toBe(5);
            expect(response.body.currentPage).toBe(2);
            expect(response.body.totalPages).toBe(2);
            expect(response.body.totalItems).toBe(15);
        });
    });

    describe('Thread operations', () => {
        let subforumId: number;

        beforeEach(async () => {
            const categoryRepository = testDataSource.getRepository(Category);
            const category = await categoryRepository.save({
                name: 'Test Category',
                description: 'This is a test category'
            });

            const subforumRepository = testDataSource.getRepository(Subforum);
            const subforum = await subforumRepository.save({
                name: 'Test Subforum',
                description: 'This is a test subforum',
                category: category
            });
            subforumId = subforum.id;
        });

        it('should create a new thread', async () => {
            const response = await request(app)
                .post('/api/forum/threads')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Thread',
                    content: 'This is a test thread',
                    subforumId: subforumId
                });

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('Test Thread');
        });

        it('should get a thread with pagination', async () => {
            const threadRepository = testDataSource.getRepository(Thread);
            const thread = await threadRepository.save({
                title: 'Test Thread',
                subforum: { id: subforumId },
                author: { id: 1 }
            });

            const postRepository = testDataSource.getRepository(Post);
            for (let i = 0; i < 15; i++) {
                await postRepository.save({
                    content: `Test Post ${i}`,
                    thread: thread,
                    author: { id: 1 }
                });
            }

            const response = await request(app)
                .get(`/api/forum/threads/${thread.id}?page=2&limit=10`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test Thread');
            expect(response.body.posts.length).toBe(5);
            expect(response.body.currentPage).toBe(2);
            expect(response.body.totalPages).toBe(2);
            expect(response.body.totalItems).toBe(15);
        });
    });

    describe('Post operations', () => {
        let threadId: number;

        beforeEach(async () => {
            const categoryRepository = testDataSource.getRepository(Category);
            const category = await categoryRepository.save({
                name: 'Test Category',
                description: 'This is a test category'
            });

            const subforumRepository = testDataSource.getRepository(Subforum);
            const subforum = await subforumRepository.save({
                name: 'Test Subforum',
                description: 'This is a test subforum',
                category: category
            });

            const threadRepository = testDataSource.getRepository(Thread);
            const thread = await threadRepository.save({
                title: 'Test Thread',
                subforum: subforum,
                author: { id: 1 }
            });
            threadId = thread.id;
        });

        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/forum/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'This is a test post',
                    threadId: threadId
                });

            expect(response.status).toBe(201);
            expect(response.body.content).toBe('This is a test post');
        });

        it('should update a post', async () => {
            const postRepository = testDataSource.getRepository(Post);
            const post = await postRepository.save({
                content: 'Original content',
                thread: { id: threadId },
                author: { id: 1 }
            });

            const response = await request(app)
                .put(`/api/forum/posts/${post.id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Updated content'
                });

            expect(response.status).toBe(200);
            expect(response.body.content).toBe('Updated content');
        });

        it('should delete a post', async () => {
            const postRepository = testDataSource.getRepository(Post);
            const post = await postRepository.save({
                content: 'Post to be deleted',
                thread: { id: threadId },
                author: { id: 1 }
            });

            const response = await request(app)
                .delete(`/api/forum/posts/${post.id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Post deleted successfully');

            const deletedPost = await postRepository.findOne({ where: { id: post.id } });
            expect(deletedPost).toBeNull();
        });
    });

    describe('Search functionality', () => {
        beforeEach(async () => {
            const categoryRepository = testDataSource.getRepository(Category);
            const category = await categoryRepository.save({
                name: 'Test Category',
                description: 'This is a test category'
            });

            const subforumRepository = testDataSource.getRepository(Subforum);
            const subforum = await subforumRepository.save({
                name: 'Test Subforum',
                description: 'This is a test subforum',
                category: category
            });

            const threadRepository = testDataSource.getRepository(Thread);
            const thread1 = await threadRepository.save({
                title: 'Test Thread 1',
                subforum: subforum,
                author: { id: 1 }
            });

            const thread2 = await threadRepository.save({
                title: 'Another Thread',
                subforum: subforum,
                author: { id: 1 }
            });

            const postRepository = testDataSource.getRepository(Post);
            await postRepository.save({
                content: 'This is a test post',
                thread: thread1,
                author: { id: 1 }
            });

            await postRepository.save({
                content: 'This is another post',
                thread: thread2,
                author: { id: 1 }
            });
        });

        it('should search for threads and posts', async () => {
            const response = await request(app)
                .get('/api/forum/search?q=test');

            expect(response.status).toBe(200);
            expect(response.body.threads.length).toBe(1);
            expect(response.body.posts.length).toBe(1);
            expect(response.body.threads[0].title).toBe('Test Thread 1');
            expect(response.body.posts[0].content).toBe('This is a test post');
        });
    });

    describe('Error handling', () => {
        it('should return 400 for invalid input', async () => {
            const response = await request(app)
                .post('/api/forum/threads')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: '', // Empty title should be invalid
                    content: 'This is a test thread',
                    subforumId: 1
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should return 404 for non-existent resource', async () => {
            const response = await request(app)
                .get('/api/forum/threads/9999'); // Assuming 9999 is a non-existent ID

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Thread not found');
        });
    });
});