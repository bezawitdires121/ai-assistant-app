import jwt from 'jsonwebtoken';
import { db } from '../services/db.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
      return res.status(401).json({ error: { message: 'Not authorized' } });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await db.read();
    const user = db.data.users.find((u) => u._id === decoded.id);
    if (!user)
      return res.status(401).json({ error: { message: 'User not found' } });

    req.user = { _id: user._id, name: user.name, email: user.email };
    next();
  } catch {
    res.status(401).json({ error: { message: 'Token invalid' } });
  }
};