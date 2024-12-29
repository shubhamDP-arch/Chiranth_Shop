import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/customer/user/user.validate';
import UserService from '@/resources/customer/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        /**
         * @swagger
         * /users/register:
         *   post:
         *     summary: Register a new user
         *     tags:
         *       - Users
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: John Doe
         *               email:
         *                 type: string
         *                 example: john.doe@example.com
         *               password:
         *                 type: string
         *                 example: Password123
         *     responses:
         *       201:
         *         description: User registered successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: string
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        /**
         * @swagger
         * /users/login:
         *   post:
         *     summary: Log in a user
         *     tags:
         *       - Users
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 example: john.doe@example.com
         *               password:
         *                 type: string
         *                 example: Password123
         *     responses:
         *       200:
         *         description: User logged in successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: string
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Get the current logged-in user
         *     tags:
         *       - Users
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Successfully retrieved user
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 data:
         *                   type: object
         *                   example:
         *                     id: 123
         *                     name: John Doe
         *                     email: john.doe@example.com
         *       404:
         *         description: No logged in user
         */
        this.router.get(`${this.path}`, authenticated, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, email, password } = req.body;
        
    
            const userInfo = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );
    
            console.log('middleware Triggered');
    
            res.status(200).json(userInfo);
        } catch (error: any) {
            if (error.message.includes('User already exists')) {
                res.status(400).json({ message: error.message });
            }  else {
                
                next(new HttpException(500, error.message || 'Internal server error.'));
            }
        }
    };
    
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body;

    
            const token = await this.UserService.login(email, password);
    
            console.log('User login successful');
    
            res.status(200).json({ token });
        } catch (error: any) {
            if (error.message.includes('No account found with this email address.')) {
                res.status(400).json({ message: error.message });
            } else if (error.message.includes('Invalid email or password')) {
                res.status(400).json({ message: error.message });
            } else if (error.message.includes('Email and password are required')) {
                res.status(400).json({ message: error.message });
            } else {
                next(new HttpException(500, error.message || 'Internal server error.'));
            }
        }
    };
    
    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): any => {
        try {
            if (!req.user) {
                return res.status(404).json({ message: 'No logged-in user found.' });
            }

            res.status(200).json({ data: req.user });
        } catch (error: any) {
            next(new HttpException(500, error.message || 'Internal server error.'));
        }
    };
    
}

export default UserController;
