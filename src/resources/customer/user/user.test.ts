import request from 'supertest';
import { connect, disconnect } from 'mongoose'; // Import connect and disconnect
import App from 'app'; // Your Express app instance
import userModel from '@/resources/customer/user/user.model'; // Assuming you have a user model
import HttpException from '@/utils/exceptions/http.exception'; 

// Mock the token creation method
jest.mock('@/utils/token', () => ({
  createToken: jest.fn().mockReturnValue('fake-jwt-token'),
}));

describe('UserController', () => {
  let app: App;  // Declare app as an instance of the App class

  beforeAll(async () => {
    app = new App([], 3000);  // Create an instance of App, pass controllers and port
    await connect('mongodb://localhost:27017/test-db'); // Provide the connection URL for your test database
  });

  afterAll(async () => {
    await disconnect(); // Disconnect after tests
  });

  beforeEach(async () => {
    await userModel.deleteMany(); // Clear the database before each test
  });

  // Test for user registration
  describe('POST /users/register', () => {
    it('should register a user successfully and return a token', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const response = await request(app.express)  // Use app.express for the actual Express app instance
        .post('/users/register')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const response = await request(app.express)  // Use app.express here too
        .post('/users/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name, email, and password are required.');
    });

    it('should return 400 if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      await request(app.express)  // Use app.express here as well
        .post('/users/register')
        .send(userData);

      const response = await request(app.express)  // Same here
        .post('/users/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists with this email.');
    });
  });

  // Test for user login
  describe('POST /users/login', () => {
    it('should log in a user and return a token', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      await request(app.express).post('/users/register').send(userData); // Register user first

      const loginData = {
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const response = await request(app.express)  // Use app.express for making requests
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('should return 400 if email or password is incorrect', async () => {
      const loginData = {
        email: 'wrong.email@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app.express)  // Use app.express here too
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No account found with this email address.');
    });

    it('should return 400 if email or password is missing', async () => {
      const loginData = {
        email: 'john.doe@example.com',
      };

      const response = await request(app.express)  // Use app.express here
        .post('/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required.');
    });
  });

  // Test for retrieving the logged-in user (authenticated route)
  describe('GET /users', () => {
    it('should return the current logged-in user data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
      };

      const registerResponse = await request(app.express)  // Use app.express
        .post('/users/register')
        .send(userData);
      const token = registerResponse.body.token;

      const response = await request(app.express)  // Use app.express
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toBe('john.doe@example.com');
    });

    it('should return 404 if no logged-in user is found', async () => {
      const response = await request(app.express)  // Use app.express
        .get('/users');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No logged-in user found.');
    });
  });
});
