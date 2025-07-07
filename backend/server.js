// Import core dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron'; // For scheduling recurring tasks

// Import route handlers
import moviesRoute from './routes/user/movieUserRoute.js';
import authRoutes from './routes/auth/auth.js';
import movieListEditorRoutes from './routes/admin/movieAdminRoute.js';
import showtimesRoutes from './routes/user/showtimes.js';
import userBookingRoutes from './routes/user/userBookings.js';
import paymentRoutes from './routes/payment/payment.js';
import stripeRoutes from "./routes/payment/stripe.js";
import bookingAdminRoute from './routes/admin/bookingAdminRoute.js';

// Import utility script to auto-generate showtimes
import { generateDummyShowtimes } from './scripts/maintainShowtimes.js';

// Load environment variables from .env file
dotenv.config();

// Set default port from environment or fallback to 5000
const PORT = process.env.PORT || 5000;

// Create an Express app
const app = express();

/* ------------------- MIDDLEWARE ------------------- */

// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to access backend
const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-booking-app-iota-murex.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

/* ------------------- ROUTES ------------------- */

// Basic health check route
app.get('/', (req, res) => {
  res.send('Movie API is running...');
});

// Main public routes for listing movies and details
app.use('/movies', moviesRoute);

// Routes for login, register, and authentication
app.use('/auth', authRoutes);

// Protected routes for admin to manage movie list (CRUD)
app.use('/admin/editing', movieListEditorRoutes);

// Protected routes for admin to manage users' bookings
app.use('/admin/bookings', bookingAdminRoute);

// Routes for showtime info and booking seats
app.use('/booking/showtimes', showtimesRoutes);

// Route for user's booking history
app.use('/user/bookings', userBookingRoutes);

// Route for payment
app.use('/payment', paymentRoutes);

// Stripe payment handler
app.use("/stripe", stripeRoutes);


/* ------------------- SERVER STARTUP ------------------- */

app.listen(PORT, async () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);

  // 🟡 On startup: Generate today's and upcoming showtimes for each movie
  await generateDummyShowtimes();

  // ⏰ Schedule a job to automatically run every night at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily showtime maintenance...');
    await generateDummyShowtimes();
  });
});
