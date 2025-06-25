// backend/routes/userBookings.js
import express from 'express';
import pool from '../../db/db.js'; // PostgreSQL connection
const router = express.Router();

/*
  GET /user/bookings/:userId
  - Fetches all bookings for a given user
  - Includes movie title, showtime start time, booked seats, booking time, and total price
*/
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await pool.query(
      `
      SELECT 
        b.id AS booking_id,
        b.user_id,
        b.showtime_id,
        b.booking_time,
        b.total_price,
        m.title AS movie_title,
        s.start_time AS showtime_datetime,
        COUNT(bs.seat_label) AS seats_quantity,
        STRING_AGG(bs.seat_label, ', ' ORDER BY bs.seat_label) AS seat_labels
      FROM bookings b
      JOIN showtimes s ON b.showtime_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN booked_seats bs ON bs.booking_id = b.id
      WHERE b.user_id = $1
      GROUP BY b.id, m.title, s.start_time
      ORDER BY s.start_time DESC
      `,
      [userId]
    );

    res.json(bookings.rows);
  } catch (err) {
    console.error('❌ Error fetching user bookings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
