import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Email and password are required',
      message: 'Invalid login request',
    });
  }

  if (email !== config.adminEmail || password !== config.adminPassword) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid credentials',
      message: 'Unauthorized',
    });
  }

  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '2h' });
  const user = {
    email,
    name: 'Admin User',
  };

  return res.status(200).json({
    success: true,
    data: { token, user },
    error: null,
    message: 'Login successful',
  });
};
