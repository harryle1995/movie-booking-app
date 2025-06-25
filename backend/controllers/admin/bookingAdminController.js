import pool from '../../db/db.js';

/* ------------------ GET ALL BOOKINGS FOR ADMIN ------------------ */
export async function getAllBookings(req, res) {
  try {
    const bookingsRes = await pool.query(
        `SELECT 
           b.id AS booking_id,
           u.username,
           m.title AS movie_title,
           s.start_time AS showtime_datetime,
           b.booking_time,
           b.total_price,
           COUNT(bs.id) AS seats_quantity,
           STRING_AGG(bs.seat_label, ', ') AS seat_labels
         FROM bookings b
         JOIN users u ON b.user_id = u.id
         JOIN showtimes s ON b.showtime_id = s.id
         JOIN movies m ON s.movie_id = m.id
         LEFT JOIN booked_seats bs ON b.id = bs.booking_id
         GROUP BY b.id, u.username, m.title, s.start_time, b.booking_time, b.total_price
         ORDER BY b.booking_time DESC`
      );

    res.json(bookingsRes.rows);
  } catch (err) {
    console.error('Failed to fetch all bookings:', err.message);
    res.status(500).send('Server error');
  }
}
