/* ------------------------- IMPORTS & CONFIG ------------------------- */
import express from 'express';
import pool from '../../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/* ------------------------- ROUTER SETUP ------------------------- */
const router = express.Router();

/* ------------------------- REGISTER USER ------------------------- */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username is taken
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into DB
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/* ------------------------- LOGIN USER ------------------------- */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userRes = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'Username does not exist' });
    }

    const user = userRes.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Respond with token and user info
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/* ------------------------- EXPORT ------------------------- */
export default router;
