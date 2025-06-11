import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get showtime details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.id, s.start_time, m.title AS movie_title
       FROM showtimes s
       JOIN movies m ON s.movie_id = m.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    const showtime = result.rows[0];

    res.json({
      id: showtime.id,
      start_time: showtime.start_time,
      movie: {
        title: showtime.movie_title,
      },
    });
  } catch (err) {
    console.error('Error fetching showtime:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get booked seats for a showtime
router.get('/:id/seats', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT seat_label
       FROM booked_seats
       WHERE showtime_id = $1`,
      [id]
    );

    const bookedSeats = result.rows.map((row) => row.seat_label);
    res.json({ bookedSeats }); // Always return an array
  } catch (err) {
    console.error('Error fetching booked seats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Book selected seats
router.post('/book', async (req, res) => {
  const { userId, showtimeId, selectedSeats } = req.body;

  if (!userId || !showtimeId || !Array.isArray(selectedSeats)) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Optionally calculate total_price here (e.g. seat count * price per seat)
    const pricePerSeat = 10; // Change this as needed
    const totalPrice = selectedSeats.length * pricePerSeat;

    // 1. Insert into bookings
    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, showtime_id, booking_time, total_price)
       VALUES ($1, $2, NOW(), $3)
       RETURNING id`,
      [userId, showtimeId, totalPrice]
    );
    const bookingId = bookingResult.rows[0].id;

    // 2. Insert booked seats
    const insertedSeats = [];
    for (const seat of selectedSeats) {
      const result = await client.query(
        `INSERT INTO booked_seats (booking_id, showtime_id, seat_label)
         VALUES ($1, $2, $3)
         RETURNING seat_label`,
        [bookingId, showtimeId, seat]
      );
      insertedSeats.push(result.rows[0].seat_label);
    }

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Booking successful',
      bookedSeats: insertedSeats,
      totalPrice,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error booking seats:', err);
    res.status(500).json({ error: 'Failed to book seats' });
  } finally {
    client.release();
  }
});

export default router;
