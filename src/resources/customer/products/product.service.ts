import Product from "./product.interface";
import productModel from "./product.model";
import { HydratedDocument } from "mongoose";
class ProductService{
  private product = productModel;
  //comment later add to admin
  public async create(name: string, quantity: number, price: number, description: string ){
  try{
    const product = await this.product.create({name, quantity, price, description})
    product.save()
    return product;
  }
  catch(error){
    throw new Error('Unable to create product')
  }
  }
  public async allProduct():Promise<HydratedDocument<Product>[]>{
    try{
      const product = await this.product.find({})
      return product;
    }
    catch(error: any){
      throw new Error('Unable to fetch category' + error)
    }
  }
  public async getProductById(id: string): Promise<Product | null>  {
    try {
      const product = await this.product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error: any) {
      throw new Error('Unable to fetch product: ' + error.message);
    }
  }
  // public async getProductByName(name: string):Promise<Product | null>{
  //   try{
  //     const product = await this.product.find({name: name});
  //     if(!product){
        
  //     }
  //   }
  // }
  
}

export default ProductService