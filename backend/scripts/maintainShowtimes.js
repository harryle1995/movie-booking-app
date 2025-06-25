// backend/scripts/maintainShowtimes.js
import pool from '../db/db.js';

export async function cleanupOldShowtimes() {
  try {
    await pool.query('DELETE FROM showtimes WHERE start_time < NOW()');
    console.log('Old showtimes deleted');
  } catch (err) {
    console.error('Error deleting old showtimes:', err);
  }
}

export async function generateDummyShowtimes() {
  try {
    const { rows: movies } = await pool.query('SELECT id FROM movies');
    const showtimeHours = [13, 16, 19]; // 1pm, 4pm, 7pm

    const now = new Date();
    const inserts = [];

    function getShowtimeDate(daysFromNow, hour) {
      const date = new Date(now);
      date.setDate(date.getDate() + daysFromNow);
      date.setHours(hour, 0, 0, 0);
      return date;
    }

    for (const movie of movies) {
      for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        for (const hour of showtimeHours) {
          const startTime = getShowtimeDate(dayOffset, hour).toISOString();
          inserts.push({
            movie_id: movie.id,
            start_time: startTime
          });
        }
      }
    }

    // Remove duplicates before inserting
    for (const showtime of inserts) {
      const { movie_id, start_time } = showtime;
      const exists = await pool.query(
        'SELECT 1 FROM showtimes WHERE movie_id = $1 AND start_time = $2',
        [movie_id, start_time]
      );
      if (exists.rows.length === 0) {
        await pool.query(
          'INSERT INTO showtimes (movie_id, start_time) VALUES ($1, $2)',
          [movie_id, start_time]
        );
        console.log(`Inserted showtime: movie_id=${movie_id}, start_time=${start_time}`);
      } else {
        console.log(`Skipped duplicate showtime: movie_id=${movie_id}, start_time=${start_time}`);
      }
    }
  } catch (err) {
    console.error('Error generating dummy showtimes:', err);
  }
}

export async function maintainShowtimes() {
  await cleanupOldShowtimes();
  await generateDummyShowtimes();
}

// Allow manual execution with `node maintainShowtimes.js`
if (process.argv[1] === new URL(import.meta.url).pathname) {
  maintainShowtimes().then(() => process.exit());
}
