import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import {
    listCategories,
    getCategory,
    createSubforum,
    getSubforum,
    createThread,
    getThread,
    deleteThread,
    createPost,
    updatePost,
    deletePost,
    searchForum
} from '../controllers/forumController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Category routes
router.get('/categories', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
], listCategories);

router.get('/categories/:id', [
    param('id').isInt().withMessage('Invalid category ID'),
    validateRequest
], getCategory);

// Subforum routes
router.post('/subforums', authenticateToken, [
    body('name').notEmpty().withMessage('Subforum name is required').isLength({ min: 3, max: 100 }).withMessage('Subforum name must be between 3 and 100 characters'),
    body('description').notEmpty().withMessage('Subforum description is required').isLength({ max: 500 }).withMessage('Subforum description must not exceed 500 characters'),
    body('categoryId').isInt().withMessage('Valid category ID is required'),
    validateRequest
], createSubforum);

router.get('/subforums/:id', [
    param('id').isInt().withMessage('Invalid subforum ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
], getSubforum);

// Thread routes
router.post('/threads', authenticateToken, [
    body('title').notEmpty().withMessage('Thread title is required').isLength({ min: 3, max: 200 }).withMessage('Thread title must be between 3 and 200 characters'),
    body('content').notEmpty().withMessage('Thread content is required').isLength({ min: 10, max: 10000 }).withMessage('Thread content must be between 10 and 10000 characters'),
    body('subforumId').isInt().withMessage('Valid subforum ID is required'),
    validateRequest
], createThread);

router.get('/threads/:id', [
    param('id').isInt().withMessage('Invalid thread ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
], getThread);

router.delete('/threads/:id', authenticateToken, [
    param('id').isInt().withMessage('Invalid thread ID'),
    validateRequest
], deleteThread);

// Post routes
router.post('/posts', authenticateToken, [
    body('content').notEmpty().withMessage('Post content is required').isLength({ min: 1, max: 10000 }).withMessage('Post content must be between 1 and 10000 characters'),
    body('threadId').isInt().withMessage('Valid thread ID is required'),
    validateRequest
], createPost);

router.put('/posts/:id', authenticateToken, [
    param('id').isInt().withMessage('Invalid post ID'),
    body('content').notEmpty().withMessage('Post content is required').isLength({ min: 1, max: 10000 }).withMessage('Post content must be between 1 and 10000 characters'),
    validateRequest
], updatePost);

router.delete('/posts/:id', authenticateToken, [
    param('id').isInt().withMessage('Invalid post ID'),
    validateRequest
], deletePost);

// Search route
router.get('/search', [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    validateRequest
], searchForum);

export default router;