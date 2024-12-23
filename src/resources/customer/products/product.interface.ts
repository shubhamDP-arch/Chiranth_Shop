import { Document, Types } from "mongoose";

export default interface Product extends Document{
  _id: Types.ObjectId,
  name: string,
  quantity: number,
  price: number,
  description: string,
  image:string
}
