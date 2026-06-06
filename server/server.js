import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { initDb } from './services/db.js';

const PORT = process.env.PORT || 5000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`[server] running on port ${PORT}`);
    console.log(`[server] health → http://localhost:${PORT}/health`);
  });
}).catch((err) => {
  console.error('[db] error:', err.message);
  process.exit(1);
});