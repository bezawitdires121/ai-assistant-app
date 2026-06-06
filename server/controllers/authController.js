import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../services/db.js';
import { v4 as uuid } from 'uuid';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: { message: 'All fields required' } });

    await db.read();
    const exists = db.data.users.find((u) => u.email === email);
    if (exists)
      return res.status(400).json({ error: { message: 'Email already in use' } });

    const hashed = await bcrypt.hash(password, 12);
    const user = {
      _id: uuid(),
      name,
      email,
      password: hashed,
      createdAt: new Date().toISOString(),
    };

    db.data.users.push(user);
    await db.write();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await db.read();
    const user = db.data.users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: { message: 'Invalid email or password' } });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};