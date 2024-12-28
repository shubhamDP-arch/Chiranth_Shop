import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/customer/categories/category.validation";
import CategoryService from "@/resources/customer/categories/category.service";
import mongoose from "mongoose";

class CategoryController implements Controller {
    public path = "/categories";
    public router = Router();
    private categoryService = new CategoryService(); // Use dependency injection in future

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        /**
         * @swagger
         * /categories/create:
         *   post:
         *     summary: Create a new category initially add the products as an empty array please
         *     tags:
         *       - Categories
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: Electronics
         *               productsId:
         *                 type: array
         *                 items:
         *                   type: string
         *                   example: 64738ad9a776f1e8c3e53f7b
         *     responses:
         *       201:
         *         description: Category created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 category:
         *                   type: object
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.read),
            this.create
        );

        /**
         * @swagger
         * /categories:
         *   get:
         *     summary: Get all categories
         *     tags:
         *       - Categories
         *     responses:
         *       201:
         *         description: Successfully retrieved all categories
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 allCategory:
         *                   type: array
         *                   items:
         *                     type: object
         *       400:
         *         description: Bad request
         */
        this.router.get(`${this.path}`, this.getAllCategory);

        /**
         * @swagger
         * /categories/getCategoryById:
         *   post:
         *     summary: Get a category by ID
         *     tags:
         *       - Categories
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *                 example: 64738ad9a776f1e8c3e53f7b
         *     responses:
         *       201:
         *         description: Successfully retrieved category by ID
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 category:
         *                   type: object
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/getCategoryById`,
            validationMiddleware(validate.getById),
            this.getCategoryById
        );

        /**
         * @swagger
         * /categories/getCategoryByName:
         *   post:
         *     summary: Get a category by name 
         *     tags:
         *       - Categories
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: Electronics
         *     responses:
         *       201:
         *         description: Successfully retrieved category by name
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 category:
         *                   type: object
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/getCategoryByName`,
            validationMiddleware(validate.getByName),
            this.getCategoryByName
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, productsId } = req.body;
            let categoryPresent = null;

            try {
                categoryPresent = await this.categoryService.getCategoryByName(name);
            } catch (error) {
                categoryPresent = null;
            }

            if (categoryPresent) {
                return next(new HttpException(400, "Category already present"));
            }

            if (!Array.isArray(productsId)) {
                return next(new HttpException(400, "Product IDs must be an array"));
            }
            

            const isValidIds = productsId.every((id: string) => mongoose.Types.ObjectId.isValid(id));
            if (!isValidIds) {
                return next(new HttpException(400, "One or more Product IDs are invalid"));
            }

            if (!name) {
                return next(new HttpException(400, "Category name is required"));
            }

            const category = await this.categoryService.create(name, productsId);
            res.status(201).json({ category });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getAllCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const allCategory = await this.categoryService.allCategory();
            res.status(201).json({ allCategory });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getCategoryById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.body;
            const category = await this.categoryService.getCategoryById(id);
            res.status(201).json({ category });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getCategoryByName = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name } = req.body;
            const category = await this.categoryService.getCategoryByName(name);
            res.status(201).json({ category });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default CategoryController;
