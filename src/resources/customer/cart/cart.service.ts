import CartModel from "./cart.model";
import { Cart } from "./cart.interface";
import ProductModel from "../products/product.model";
import HttpException from "@/utils/exceptions/http.exception";
import { Types } from "mongoose";

class CartService {

  public async addToCart(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number): Promise<Cart> {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new HttpException(404, "Product not found");
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = await CartModel.create({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));

    if (itemIndex > -1) {
     
      cart.items[itemIndex].quantity += quantity;
    } else {
      
      cart.items.push({ productId, quantity });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (product?.price || 0),
      0
    );

    await cart.save();
    return cart;
  }


  public async removeFromCart(userId: Types.ObjectId, productId: Types.ObjectId): Promise<Cart> {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      throw new HttpException(404, "Cart not found");
    }

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (item.productId as any)?.price || 0,
      0
    );

    await cart.save();
    return cart;
  }

  public async getCart(userId: Types.ObjectId): Promise<Cart | null> {
    return CartModel.findOne({ userId }).populate("items.productId");
  }
}

export default CartService;
