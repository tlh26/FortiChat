const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createUser, findUserByEmail } = require('Backend/Models/userModel.js');

// Encryption key for AES-256-CBC
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 characters (256 bits)

// Function to encrypt data using AES-256-CBC
const encryptData = (data, iv) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Function to decrypt data using AES-256-CBC
const decryptData = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Register User
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Hash and salt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique IV for this encryption
        const iv = crypto.randomBytes(16); // 16 bytes = 128 bits

        // Encrypt the hashed password using AES-256-CBC and the unique IV
        const encryptedPassword = encryptData(hashedPassword, iv);

        // Store the encrypted password and IV in the database
        const user = await createUser(email, encryptedPassword, iv.toString('hex'));

        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Extract the IV stored in the database
        const iv = Buffer.from(user.password_iv, 'hex');

        // Decrypt the stored encrypted password
        const decryptedPassword = decryptData(user.password, iv);

        // Compare the provided password with the decrypted (hashed) password
        const isMatch = await bcrypt.compare(password, decryptedPassword);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { registerUser, loginUser };
