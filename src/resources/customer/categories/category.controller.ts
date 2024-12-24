import { Request, Response, NextFunction, Router } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/customer/categories/category.validation"
import CategoryService from "@/resources/customer/categories/category.service";
import mongoose from "mongoose";

class CategoryController implements Controller{
  public path = "/categories";
  public router = Router();
  private categoryService = new CategoryService(); //use dependency injection in future

  constructor(){
    this.initialiseRoutes();
  }
  private initialiseRoutes(): void{
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(validate.read),
      this.create
    )
    this.router.get(
      `${this.path}`,
      this.getAllCategory
    )
    this.router.post(
      `${this.path}/getCategoryById`,
      validationMiddleware(validate.getById),
      this.getCategoryById
    )
    this.router.post(
      `${this.path}/getCategoryByName`,
      validationMiddleware(validate.getByName),
      this.getCategoryByName
    )
  }
  //later to be commented
  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, productsId } = req.body;
      let categoryPresent=null
      try{
        categoryPresent = await this.categoryService.getCategoryByName(name)
      }
      catch(error){
        categoryPresent = null
      }
      if(categoryPresent){
        return next(new HttpException(400, "Category already present"));
      }
      if (!Array.isArray(productsId)) {
        return next(new HttpException(400, "Product IDs must be an array"));
      }
  
      const isValidIds = productsId.every((id: string) => mongoose.Types.ObjectId.isValid(id));
      if (!isValidIds) {
        return next(new HttpException(400, "One or more Product IDs are invalid"));
      }
  
      if (!name) {
        return next(new HttpException(400, "Category name is required"));
      }
  
      const category = await this.categoryService.create(name, productsId);
      res.status(201).json({ category });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getAllCategory = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=> {
    try{
      const allCategory = await this.categoryService.allCategory()
      res.status(201).json({allCategory})
    }
    catch(error:any){
      next(new HttpException(400, error.message))
    }
  }
  private getCategoryById = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=> {
    try{
      const {id} = req.body;
      const category = await this.categoryService.getCategoryById(id)
      res.status(201).json({category})
    }
    catch(error:any){
      next(new HttpException(400, error.message))
    }
  }
  private getCategoryByName = async(
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<void>=> {
    try{
      const {name} = req.body;
      const category = await this.categoryService.getCategoryByName(name)
      res.status(201).json({category})
    }
    catch(error:any){
      next(new HttpException(400, error.message))
    }
  }

}
export default CategoryController