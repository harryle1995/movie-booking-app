// backend/db/booking.js
import pool from "./db.js";

/**
 * Inserts a booking and its selected seats into the database.
 */
export async function insertBooking({ userId, showtimeId, selectedSeats, totalPrice, stripeSessionId }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 🛡️ Check if booking already exists for this session
    const check = await client.query(
      `SELECT id FROM bookings WHERE stripe_session_id = $1`,
      [stripeSessionId]
    );
    if (check.rows.length > 0) {
      console.log("⚠️ Booking already exists for session:", stripeSessionId);
      await client.query("ROLLBACK");
      return; // skip duplicate insert
    }

    const bookingResult = await client.query(
      `
      INSERT INTO bookings (user_id, showtime_id, booking_time, total_price, stripe_session_id)
      VALUES ($1, $2, NOW(), $3, $4)
      RETURNING id
      `,
      [userId, showtimeId, totalPrice, stripeSessionId]
    );

    const bookingId = bookingResult.rows[0].id;

    const seatInsertPromises = selectedSeats.map((seatLabel) => {
      return client.query(
        `
        INSERT INTO booked_seats (booking_id, showtime_id, seat_label)
        VALUES ($1, $2, $3)
        `,
        [bookingId, showtimeId, seatLabel]
      );
    });

    await Promise.all(seatInsertPromises);
    await client.query("COMMIT");
    console.log("✅ Booking created");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Booking error:", err);
    throw err;
  } finally {
    client.release();
  }
}
