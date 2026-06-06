import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'https://nova-ai-chatbot-2026.vercel.app',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use(errorHandler);

export default app;