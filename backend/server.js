import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import moviesRoute from './routes/movies.js';
import authRoutes from './routes/auth.js';
import { generateDummyShowtimes } from './scripts/maintainShowtimes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Movie API is running...');
});
app.use('/now-showing', moviesRoute);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);

  // Run showtime generation once at startup
  await generateDummyShowtimes();

  // Schedule to run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily showtime maintenance...');
    await generateDummyShowtimes();
  });
});
