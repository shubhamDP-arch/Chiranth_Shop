import { Schema, model } from 'mongoose';
import Product from '@/resources/customer/products/product.interface';


const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image:{type:String, required:true}
}, {
  timestamps: true 
});

export default model<Product>('Product', ProductSchema);