import User from "@/resources/customer/user/user.interface";

declare global{
  namespace Express{
    export interface Request{
      user: User
    }
  }
}