import userModel from "@/resources/customer/user/user.model";
import token from "@/utils/token";
import User from "./user.interface";
class UserService{
  private user = userModel

  public async register(name: string, email: string, password: string, role: string): Promise<User>{
    try {

        const existingUser = await this.user.findOne({email });
        console.log(existingUser)
        if (existingUser) {
            console.log("hello exist")
            throw new Error('User already exists with this email.');
        }

        const user = await this.user.create({
            name,
            email,
            password,
            role,
        });

        return user;
    } catch (error: any) {
        throw new Error(error.message || 'Unable to create user.');
    }
}

public async login(email: string, password: string): Promise<string> {
  try {

      const user = await this.user.findOne({ email });

      if (!user) {
          throw new Error('No account found with this email address.');
      }

      const isPasswordValid = await user.isValidPassword(password);
      if (!isPasswordValid) {
          throw new Error('Invalid email or password.');
      }

      return token.createToken(user);
  } catch (error: any) {
      throw new Error(error.message || 'An error occurred during login.');
  }
}

}

export default UserService