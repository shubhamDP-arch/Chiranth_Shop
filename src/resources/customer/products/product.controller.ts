import Controller from "@/utils/interfaces/controller.interface";
import { Router } from "express";
import ProductService from "./product.service";
import { Request, Response, NextFunction } from "express";
import CategoryService from "../categories/category.service";
import HttpException from "@/utils/exceptions/http.exception";
import { Types } from "mongoose";
import validate from "@/resources/customer/products/product.validate";
import validationMiddleware from "@/middleware/validation.middleware";

class ProductController implements Controller {
    public path = "/products";
    public router = Router();
    private productService = new ProductService();
    private categoryService = new CategoryService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        /**
         * @swagger
         * /products/create:
         *   post:
         *     summary: Create a new product
         *     tags:
         *       - Products
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 example: Laptop
         *               quantity:
         *                 type: integer
         *                 example: 10
         *               price:
         *                 type: number
         *                 example: 599.99
         *               description:
         *                 type: string
         *                 example: High-performance laptop
         *               categoryId:
         *                 type: string
         *                 example: 64738ad9a776f1e8c3e53f7b
         *     responses:
         *       201:
         *         description: Product created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.createProductValidation),
            this.create
        );

        /**
         * @swagger
         * /products/allProduct:
         *   get:
         *     summary: Get all products
         *     tags:
         *       - Products
         *     responses:
         *       201:
         *         description: Successfully retrieved all products
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 type: object
         *       400:
         *         description: Bad request
         */
        this.router.get(`${this.path}/allProduct`, this.getAllProduct);

        /**
         * @swagger
         * /products/productById:
         *   post:
         *     summary: Get product details by ID
         *     tags:
         *       - Products
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               productId:
         *                 type: string
         *                 example: 64738ad9a776f1e8c3e53f7b
         *     responses:
         *       201:
         *         description: Successfully retrieved product details
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *       400:
         *         description: Bad request
         */
        this.router.post(
            `${this.path}/productById`,
            validationMiddleware(validate.productByIdValidation),
            this.productDetailById
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, quantity, price, description, categoryId } = req.body;


            if (!Types.ObjectId.isValid(categoryId)) {
                return next(new HttpException(400, "Invalid category ID"));
            }

            console.log("hello")
            const product = await this.productService.create(
                name,
                quantity,
                price,
                description
            );

            if (!product || !product._id) {
                return next(new HttpException(400, "Failed to create product"));
            }

           
            const category = await this.categoryService.getCategoryById(categoryId);
            if (!category) {
                return next(new HttpException(404, "Category not found"));
            }

            category.products.push(product._id as Types.ObjectId);
            await category.save();

            res.status(201).json({ product });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };


    private getAllProduct = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const allProducts = await this.productService.allProduct();
            res.status(200).json({ products: allProducts });
        } catch (error: any) {
            next(new HttpException(500, "Unable to fetch products"));
        }
    };


    private productDetailById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { productId } = req.body;

       
            if (!Types.ObjectId.isValid(productId)) {
                return next(new HttpException(400, "Invalid product ID"));
            }

            const productDetail = await this.productService.getProductById(productId);
            if (!productDetail) {
                return next(new HttpException(404, "Product not found"));
            }

            res.status(200).json({ product: productDetail });
        } catch (error: any) {
            next(new HttpException(500, error.message));
        }
    };
}


export default ProductController;
