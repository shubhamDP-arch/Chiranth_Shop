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

            const token = await this.UserService.register(
                name,
                email,
                password,
                'user'
            );
            console.log('middleware Triggered');

            res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
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

            res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    };
}

export default UserController;
