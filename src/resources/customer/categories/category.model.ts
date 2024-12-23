import { Schema, model } from 'mongoose';
import Category from '@/resources/customer/categories/category.interface';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        products: [
          {
            type: Schema.Types.ObjectId,
            ref: "Product"
          }
        ]
    },
    { timestamps: true }
);

export default model<Category>('Category', CategorySchema);