import categoryModel from "@/resources/customer/categories/category.model";
import Category from "@/resources/customer/categories/category.interface";
import { Document, Types } from "mongoose";

class CategoryService {
    private category = categoryModel;


    public async create(name: string, productsId: string[]): Promise<Category> {
        try {
            const category = await this.category.create({ name, products: productsId });
            return category;
        } catch (error: any) {
            throw new Error("Unable to create category. Please try again later.");
        }
    }


    public async allCategory(): Promise<(Document<unknown, {}, Category> & Category)[]> {
        try {
            const categories = await this.category.find({}).populate("products");
            return categories;
        } catch (error: any) {
            throw new Error("Unable to fetch categories: " + error.message);
        }
    }


    public async getCategoryById(id: string): Promise<(Document<unknown, {}, Category> & Category)> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error("Invalid category ID");
            }

            const category = await this.category.findById(id).populate("products");
            if (!category) {
                throw new Error("Category not found");
            }

            return category;
        } catch (error: any) {
            throw new Error("Unable to fetch category by ID: " + error.message);
        }
    }


    public async getCategoryByName(name: string): Promise<any> {
            const category = await this.category.findOne({ name }).populate("products");

            return category;
    
    }
}

export default CategoryService;
