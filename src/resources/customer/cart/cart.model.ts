import { Cart, CartItem } from "./cart.interface";
import {model, Schema} from "mongoose";


const CartItemSchema = new Schema<CartItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<Cart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, default: 0 },
});

export default model<Cart>("Cart", CartSchema);
