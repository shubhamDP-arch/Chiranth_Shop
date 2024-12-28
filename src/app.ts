import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import helmet from 'helmet';

import ErrorMiddleware from './middleware/error.middleware';


class App{
  public express: Application;
  public port: number

  constructor(controllers: Controller[], port: number){
    this.express = express()
    this.port = port

    this.initialiseDatabaseConnection()
    this.initialiseMiddleware()
    this.initialiseControllers(controllers)
    this.initialiseErrorHandling()
  }
  private initialiseMiddleware(): void{
    this.express.use(helmet())
    this.express.use(cors())
    this.express.use(morgan('dev'))
    this.express.use(express.json())
    this.express.use(express.urlencoded({extended:false}))
    this.express.use(compression())
    this.initialiseSwagger();
    

  }
  private initialiseControllers(controllers: Controller[]): void{
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router)
    })
  
  
  }
  private initialiseErrorHandling(): void{
    this.express.use(ErrorMiddleware)

  }
  private initialiseDatabaseConnection(): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    // mongoose.connect(
    //     `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
    // );
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}?retryWrites=true&w=majority&appName=Cluster0`
    ).then(
      ()=>{
        console.log("Connected DB")
      }
    )

}
private initialiseSwagger(): void {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express API with Swagger',
        version: '1.0.0',
        description: 'API documentation for your Express app',
      },
      servers: [
        {
          url: `http://localhost:${this.port}/api`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/**/*.ts'], // Path to the API docs
  };
  const specs = swaggerJsdoc(options);
  this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
  public listen(): void{
    this.express.listen(this.port,  ()=>{
      console.log(`App is listening on port ${this.port}`)
      console.log(`Swagger docs available at http://localhost:${this.port}/api-docs`);
    })
  }

}

export default App;