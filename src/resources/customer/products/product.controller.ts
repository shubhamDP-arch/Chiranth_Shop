import Controller from "@/utils/interfaces/controller.interface";
import { Router } from "express";
import ProductService from "./product.service";
import { Request, Response, NextFunction } from "express";
import CategoryService from "../categories/category.service";
import HttpException from "@/utils/exceptions/http.exception";
import { Types } from "mongoose";

class ProductController implements Controller{
  public path = "/products";
  public router = Router();
  private productService = new ProductService();
  private categoryService = new CategoryService();

  constructor(){
    this.initialiseRoutes();
  }
  private initialiseRoutes(): void{
    this.router.post(
      `${this.path}/create`,
      this.create
    )
    this.router.get(
      `${this.path}/allProduct`,
      this.getAllProduct
    )
    this.router.post(
      `${this.path}/productById`,
      this.productDetailById
    )
    // this.router.post(
    //   `${this.path}/getCategoryById`,
    //   validationMiddleware(validate.getById),
    //   this.getCategoryById
    // )
    // this.router.post(
    //   `${this.path}/getCategoryByName`,
    //   validationMiddleware(validate.getByName),
    //   this.getCategoryByName
    // )
  }
  //comment this out later
  private create = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=> {
    try{
      const {name, quantity,price, description, categoryId } = req.body;
      const product = await this.productService.create(name, quantity, price, description)
      const category = await this.categoryService.getCategoryById(categoryId)
      if(!product || !product._id){
        next(new HttpException(400, "Product id not given properly"))
      }
      const productId = product._id as Types.ObjectId;
      category.products.push(productId)
      await category.save();
      await product.save()
      res.status(201).send(product)

    }
    catch(error:any){
        next(new HttpException(400, error.message))
    }
  }
  private getAllProduct = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=> {
    try{
      const allProduct = await this.productService.allProduct()
      res.status(201).send(allProduct)
    }
    catch(error:any){
      next(new HttpException(400, error.message))
    }
  }

  private productDetailById = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=>{
    try{
      const {productId} = req.body;
      const productDetail = await this.productService.getProductById(productId);
      res.status(201).send(productDetail)
    }
    catch(error:any){
      next(new HttpException(400, error.message))
    }
  }
  

}

export default ProductController