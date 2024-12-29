import { Request, Response, NextFunction, Router } from "express";
import { Types } from "mongoose";
import CartService from "./cart.service";
import HttpException from "@/utils/exceptions/http.exception";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing user carts
 */
class CartController {
  public path = "/cart";
  public router = Router();
  private cartService = new CartService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    /**
     * @swagger
     * /cart/add:
     *   post:
     *     summary: Add a product to the user's cart
     *     tags: [Cart]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - productId
     *               - quantity
     *             properties:
     *               userId:
     *                 type: string
     *                 description: The ID of the user
     *                 example: "64a7c3f9e1d3c9b8f0e7d9a1"
     *               productId:
     *                 type: string
     *                 description: The ID of the product to add
     *                 example: "64a7c3f9e1d3c9b8f0e7d9b2"
     *               quantity:
     *                 type: integer
     *                 description: Quantity of the product to add
     *                 example: 2
     *     responses:
     *       200:
     *         description: Product added to cart successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product added to cart successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Cart'
     *       400:
     *         description: Bad request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(`${this.path}/add`, this.addToCart);

    /**
     * @swagger
     * /cart/remove:
     *   post:
     *     summary: Remove a product from the user's cart
     *     tags: [Cart]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - userId
     *               - productId
     *             properties:
     *               userId:
     *                 type: string
     *                 description: The ID of the user
     *                 example: "64a7c3f9e1d3c9b8f0e7d9a1"
     *               productId:
     *                 type: string
     *                 description: The ID of the product to remove
     *                 example: "64a7c3f9e1d3c9b8f0e7d9b2"
     *     responses:
     *       200:
     *         description: Product removed from cart successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Product removed from cart successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Cart'
     *       400:
     *         description: Bad request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.post(`${this.path}/remove`, this.removeFromCart);

    /**
     * @swagger
     * /cart:
     *   get:
     *     summary: Retrieve the user's cart
     *     tags: [Cart]
     *     parameters:
     *       - in: query
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the user
     *         example: "64a7c3f9e1d3c9b8f0e7d9a1"
     *     responses:
     *       200:
     *         description: Cart retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Cart retrieved successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Cart'
     *       400:
     *         description: Bad request - Invalid input
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    this.router.get(`${this.path}`, this.getCart);
  }


  private addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, productId, quantity } = req.body;

      if (!userId || !productId || !quantity) {
        throw new HttpException(
          400,
          "userId, productId, and quantity are required"
        );
      }


      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(productId)
      ) {
        throw new HttpException(400, "Invalid userId or productId format");
      }

      const cart = await this.cartService.addToCart(
        new Types.ObjectId(userId),
        new Types.ObjectId(productId),
        quantity
      );
      res.status(200).json({
        message: "Product added to cart successfully",
        data: cart,
      });
    } catch (error: any) {
      next(
        new HttpException(
          400,
          error.message || "Unable to add product to cart"
        )
      );
    }
  };


  private removeFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, productId } = req.body;

      if (!userId || !productId) {
        throw new HttpException(400, "userId and productId are required");
      }

      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(productId)
      ) {
        throw new HttpException(400, "Invalid userId or productId format");
      }

      const cart = await this.cartService.removeFromCart(
        new Types.ObjectId(userId),
        new Types.ObjectId(productId)
      );
      res.status(200).json({
        message: "Product removed from cart successfully",
        data: cart,
      });
    } catch (error: any) {
      next(
        new HttpException(
          400,
          error.message || "Unable to remove product from cart"
        )
      );
    }
  };
  private getCart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.query;

      if (!userId) {
        throw new HttpException(400, "userId is required");
      }

      if (!Types.ObjectId.isValid(userId as string)) {
        throw new HttpException(400, "Invalid userId format");
      }

      const cart = await this.cartService.getCart(
        new Types.ObjectId(userId as string)
      );
      if(!cart){
        throw new HttpException(400, "Cart data not avaliable")
      }
      res.status(200).json({
        message: "Cart retrieved successfully",
        data: cart,
      });
    } catch (error: any) {
      next(
        new HttpException(
          400,
          error.message || "Unable to retrieve cart"
        )
      );
    }
  };
}

export default CartController;
