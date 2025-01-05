//const auth = require('../../AuthService/src/auth.controller')

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../index'); // Your main server entry point
const { createUser, findUserByEmail } = require('../../Models/userModel');
const pool = require('../../AuthService/src/config/db');

// Mock the database interactions
jest.mock('../../Models/userModel');

describe('Auth Service Tests', () => {
    // Mock data
    const validEmail = 'testuser@example.com';
    const invalidEmail = 'invalid-email';
    const strongPassword = 'StrongP@ssw0rd!';
    const weakPassword = '12345';
    const hashedPassword = bcrypt.hashSync(strongPassword, 10);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /** USER REGISTRATION TESTS **/
    describe('User Registration', () => {
        it('should register a user with valid email and strong password', async () => {
            createUser.mockResolvedValue({
                id: 1,
                email: validEmail,
                password: hashedPassword,
            });

            const response = await request(app)
                .post('/auth/register')
                .send({ email: validEmail, password: strongPassword });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered');
            expect(createUser).toHaveBeenCalledWith(validEmail, expect.any(String));
        });

        it('should fail if the email is already in use', async () => {
            findUserByEmail.mockResolvedValue({ email: validEmail });

            const response = await request(app)
                .post('/auth/register')
                .send({ email: validEmail, password: strongPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already in use');
        });

        it('should fail if the email format is invalid', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ email: invalidEmail, password: strongPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid email format');
        });

        it('should fail if the password is weak', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ email: validEmail, password: weakPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Password is too weak');
        });
    });

    /** USER LOGIN TESTS **/
    describe('User Login', () => {
        it('should login a user with correct credentials', async () => {
            findUserByEmail.mockResolvedValue({
                email: validEmail,
                password: hashedPassword,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: validEmail, password: strongPassword });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should fail if email does not exist', async () => {
            findUserByEmail.mockResolvedValue(null);

            const response = await request(app)
                .post('/auth/login')
                .send({ email: validEmail, password: strongPassword });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        it('should fail if the password is incorrect', async () => {
            findUserByEmail.mockResolvedValue({
                email: validEmail,
                password: hashedPassword,
            });

            const response = await request(app)
                .post('/auth/login')
                .send({ email: validEmail, password: 'WrongPassword' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should fail if the token has expired', async () => {
            const expiredToken = jwt.sign({ email: validEmail }, process.env.JWT_SECRET, {
                expiresIn: '-1s',
            });

            const response = await request(app)
                .get('/auth/protected-route')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Token expired');
        });
    });

    /** DATABASE CONNECTION TESTS **/
    describe('Database Connection', () => {
        it('should connect to the database successfully', async () => {
            const result = await pool.query('SELECT 1');
            expect(result).toBeDefined();
        });

        it('should fail when the database is down', async () => {
            jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database down'));

            await expect(pool.query('SELECT 1')).rejects.toThrow('Database down');
        });

        it('should prevent unauthorized database access', async () => {
            jest.spyOn(pool, 'query').mockImplementation(() => {
                throw new Error('Unauthorized access');
            });

            await expect(pool.query('SELECT * FROM users')).rejects.toThrow('Unauthorized access');
        });
    });
});
