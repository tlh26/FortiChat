const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../../index'); // Your main server entry point
const { createUser, findUserByEmail } = require('../../Models/userModel');
const pool = require('../../AuthService/src/config/db');

// Mock the database interactions
//jest.mock('../../Models/userModel');

// Load test environment variables
//require('dotenv').config({ path: '.env.test' });
require('dotenv')

describe('Auth Service Tests', () => {
    // Mock data
    const validEmail = 'anothertestuser@example.com';
    const invalidEmail = 'invalid-email';
    const strongPassword = 'StrongP@ssw0rd!';
    const weakPassword = '12345';
    let hashedPassword;
    const regEmail = 'testuser@example.com'; //already registered email/user
   // hashedPassword = bcrypt.hashSync(strongPassword, 10);
    let iv;
    beforeAll(async () => {
        // Ensure the database connection is established
      //  await pool.connect();

        // Ensure the database connection pool is ready
        await pool.query('SELECT 1'); // Test pool readiness
    });

    beforeEach(async () => {
        // Start a transaction for isolation
        await pool.query('BEGIN');

        // Hash a test password
        hashedPassword = await bcrypt.hash(strongPassword, 10);

        // Generate an IV for password encryption
        iv = '21697fd7afbb0819b9e6e26f26dce2cd'; // You may use a better method to generate the IV

        // Seed the database with a test user
        await pool.query(
            'INSERT INTO users (email, password, password_iv) VALUES ($1, $2, $3)',
            [validEmail, hashedPassword, iv]
        );
    });

    afterEach(async () => {
        // Rollback the transaction to undo changes
        await pool.query('ROLLBACK');
    });

    afterAll(async () => {
        // Close the database connection pool
        await pool.end();
    }, 50000); // Timeout increased to 10 seconds

    /** USER REGISTRATION TESTS **/
    describe('User Registration', () => {
        it('should register a user with valid email and strong password', async () => {
            const newEmail = 'newuser@example.com';
            const response = await request(app)
                .post('/fortiChat/auth/register')
                .send({ email: newEmail, password: strongPassword });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered');

            const user = await pool.query('SELECT * FROM users WHERE email = $1', [newEmail]);
            expect(user.rows.length).toBe(1);
            expect(user.rows[0].email).toBe(newEmail);
        });

        it('should fail if the email is already in use', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/register')
                .send({ email: validEmail, password: strongPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already in use');
        });

        it('should fail if the email format is invalid', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/register')
                .send({ email: invalidEmail, password: strongPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid email format');
        });

        it('should fail if the password is weak', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/register')
                .send({ email: 'weakpassword@example.com', password: weakPassword });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Password is too weak');
        });
    });

    /** USER LOGIN TESTS **/
    describe('User Login', () => {
        it('should login a user with correct credentials', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/login')
                .send({ email: regEmail, password: strongPassword });

            expect(response.status).toBe(200);
            expect(response.body.token).toBeDefined();
        });

        it('should fail if email does not exist', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/login')
                .send({ email: 'nonexistent@example.com', password: strongPassword });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('User not found');
        });

        it('should fail if the password is incorrect', async () => {
            const response = await request(app)
                .post('/fortiChat/auth/login')
                .send({ email: regEmail, password: 'WrongPassword' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });

        // it('should fail if the token has expired', async () => {
        //     const expiredToken = jwt.sign({ email: validEmail }, process.env.JWT_SECRET, {
        //         expiresIn: '-1s',
        //     });

        //     const response = await request(app)
        //         .get('/fortiChat/auth/login')
        //         .set('Authorization', `Bearer ${expiredToken}`);

        //     expect(response.status).toBe(401);
        //     expect(response.body.error).toBe('Token expired');
        // });
    });

    // /** DATABASE CONNECTION TESTS **/
    describe('Database Connection', () => {
        it('should connect to the database successfully', async () => {
            const result = await pool.query('SELECT 1');
            expect(result).toBeDefined();
        });
    });
});
