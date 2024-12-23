import { Document } from "mongoose";
import { Types } from "mongoose";
export default interface Category extends Document{
  name: string,
  products: Types.ObjectId[], 
}
