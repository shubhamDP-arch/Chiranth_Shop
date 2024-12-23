import 'dotenv/config';
import 'module-alias/register';

import App from './app';
import validateEnv from './utils/validateEnv';
import UserController from './resources/customer/user/user.controller';
import CategoryController from './resources/customer/categories/category.controller';
import ProductController from './resources/customer/products/product.controller';
validateEnv()

const app = new App([new UserController(), new CategoryController(), new ProductController()],
    Number(process.env.PORT)
);

app.listen();