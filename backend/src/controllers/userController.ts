import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        const userRepository = getRepository(User);

        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = userRepository.create({
            username,
            email,
            password_hash: hashedPassword,
            isAdmin: isAdmin || false
        });

        await userRepository.save(user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const userRepository = getRepository(User);

        // Find user
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({ message: 'Logged in successfully', token, isAdmin: user.isAdmin });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

export const getUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't send password hash
        const { password_hash, ...userInfo } = user;
        res.json(userInfo);
    } catch (error) {
        console.error('Error in getUserInfo:', error);
        res.status(500).json({ message: 'Error fetching user info' });
    }
};

export const updateUserInfo = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { email, password } = req.body;
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) {
            user.email = email;
        }

        if (password) {
            user.password_hash = await bcrypt.hash(password, 10);
        }

        await userRepository.save(user);

        const { password_hash, ...updatedUserInfo } = user;
        res.json({ message: 'User information updated successfully', user: updatedUserInfo });
    } catch (error) {
        console.error('Error in updateUserInfo:', error);
        res.status(500).json({ message: 'Error updating user information' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userRepository.remove(user);

        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Error deleting user account' });
    }
};