const pool = require('../AuthService/src/config/db');

const createUser = async (email, encryptedPassword, iv) => {
    const result = await pool.query(
        'INSERT INTO users (email, password, password_iv) VALUES ($1, $2, $3) RETURNING *',
        [email, encryptedPassword, iv]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

module.exports = { createUser, findUserByEmail };
