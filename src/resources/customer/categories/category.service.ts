import categoryModel from "@/resources/customer/categories/category.model";
import Category from "@/resources/customer/categories/category.interface";
import { Document, Types } from "mongoose";

class CategoryService{
  private category = categoryModel;

public async create(name: string, productsId: string[]): Promise<Category> {
  try {
    const category = await this.category.create({ name, products: productsId });
    return category;
  } catch (error) {
    throw new Error("Unable to create category");
  }
}
  public async allCategory(): Promise<(Document<unknown, {}, Category> & Category)[]>{
    try{
      const category = await this.category.find({}).populate('products')
      return category;
    }
    catch(error: any){
      throw new Error('Unable to fetch category' + error)
    }
  }
  public async getCategoryById(id: string): Promise<(Document<unknown, {}, Category> & Category)>{
    try{
      const newid = new Types.ObjectId(id)
      const category = await this.category.findOne({_id: newid}).populate('products')
      if (!category) {
        throw new Error('Category not found');
      }
      return category
    }
    catch(error){
      throw new Error('Unable to fetch category')
    }
  }
  public async getCategoryByName(name:string):Promise<(Document<unknown, {}, Category> & Category)>{
    try{
      const category = await this.category.findOne({name: name}).populate('products')
      if (!category) {
        throw new Error('Category not found');
      }
      return category
    }
    catch(error){
      throw new Error('Unable to fetch category')
    }
  }
}

export default CategoryService;