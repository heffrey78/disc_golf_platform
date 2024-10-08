import { Request, Response } from 'express';
import { getRepository, Like } from 'typeorm';
import { validationResult } from 'express-validator';
import { Category } from '../entity/Category';
import { Subforum } from '../entity/Subforum';
import { Thread } from '../entity/Thread';
import { Post } from '../entity/Post';
import { User } from '../entity/User';

// Extend the Request type to include the user property
interface AuthRequest extends Request {
    user?: User;
}

export const listCategories = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const categoryRepository = getRepository(Category);
        const [categories, total] = await categoryRepository.findAndCount({
            relations: ['subforums'],
            skip,
            take: limit,
        });

        res.json({
            categories,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        console.error('Error in listCategories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categoryRepository = getRepository(Category);
        const category = await categoryRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['subforums'] });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error in getCategory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createSubforum = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, description, categoryId } = req.body;
        const subforumRepository = getRepository(Subforum);
        const categoryRepository = getRepository(Category);

        const category = await categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subforum = subforumRepository.create({
            name,
            description,
            category
        });

        await subforumRepository.save(subforum);
        res.status(201).json(subforum);
    } catch (error) {
        console.error('Error in createSubforum:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubforum = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const subforumRepository = getRepository(Subforum);
        const subforum = await subforumRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['threads'],
        });

        if (!subforum) {
            return res.status(404).json({ message: 'Subforum not found' });
        }

        const [threads, total] = await getRepository(Thread).findAndCount({
            where: { subforum: subforum },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        res.json({
            ...subforum,
            threads,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        console.error('Error in getSubforum:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createThread = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, content, subforumId } = req.body;
        const threadRepository = getRepository(Thread);
        const subforumRepository = getRepository(Subforum);
        const postRepository = getRepository(Post);

        const subforum = await subforumRepository.findOne({ where: { id: subforumId } });
        if (!subforum) {
            return res.status(404).json({ message: 'Subforum not found' });
        }

        const thread = threadRepository.create({
            title,
            subforum,
            author: req.user
        });

        await threadRepository.save(thread);

        const post = postRepository.create({
            content,
            thread,
            author: req.user
        });

        await postRepository.save(post);

        res.status(201).json(thread);
    } catch (error) {
        console.error('Error in createThread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getThread = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const threadRepository = getRepository(Thread);
        const thread = await threadRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['author'],
        });

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        const [posts, total] = await getRepository(Post).findAndCount({
            where: { thread: thread },
            relations: ['author'],
            skip,
            take: limit,
            order: { createdAt: 'ASC' },
        });

        res.json({
            ...thread,
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (error) {
        console.error('Error in getThread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content, threadId } = req.body;
        const postRepository = getRepository(Post);
        const threadRepository = getRepository(Thread);

        const thread = await threadRepository.findOne({ where: { id: threadId } });
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        const post = postRepository.create({
            content,
            thread,
            author: req.user
        });

        await postRepository.save(post);
        res.status(201).json(post);
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content } = req.body;
        const postRepository = getRepository(Post);

        const post = await postRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['author'] });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.id !== req.user?.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        post.content = content;
        await postRepository.save(post);

        res.json(post);
    } catch (error) {
        console.error('Error in updatePost:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const postRepository = getRepository(Post);

        const post = await postRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['author'] });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.id !== req.user?.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await postRepository.remove(post);

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchForum = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const threadRepository = getRepository(Thread);
        const postRepository = getRepository(Post);

        const [threads, threadTotal] = await threadRepository.findAndCount({
            where: { title: Like(`%${query}%`) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['author', 'subforum'],
        });

        const [posts, postTotal] = await postRepository.findAndCount({
            where: { content: Like(`%${query}%`) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
            relations: ['author', 'thread'],
        });

        res.json({
            threads,
            posts,
            currentPage: page,
            totalPages: Math.ceil((threadTotal + postTotal) / limit),
            totalItems: threadTotal + postTotal,
        });
    } catch (error) {
        console.error('Error in searchForum:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteThread = async (req: AuthRequest, res: Response) => {
    try {
        const threadRepository = getRepository(Thread);

        const thread = await threadRepository.findOne({ 
            where: { id: parseInt(req.params.id) }, 
            relations: ['author', 'posts'] 
        });

        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        if (thread.author.id !== req.user?.id && !req.user?.isAdmin) {
            return res.status(403).json({ message: 'You are not authorized to delete this thread' });
        }

        // Delete all posts associated with the thread
        const postRepository = getRepository(Post);
        await postRepository.remove(thread.posts);

        // Delete the thread
        await threadRepository.remove(thread);

        res.json({ message: 'Thread and associated posts deleted successfully' });
    } catch (error) {
        console.error('Error in deleteThread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};