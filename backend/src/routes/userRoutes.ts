import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser, getUserInfo, updateUserInfo, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

const validateRegistration = [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateUpdateUser = [
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/register', validateRegistration, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.get('/me', authenticateToken, getUserInfo);
router.put('/me', authenticateToken, validateUpdateUser, handleValidationErrors, updateUserInfo);
router.delete('/me', authenticateToken, deleteUser);

export default router;