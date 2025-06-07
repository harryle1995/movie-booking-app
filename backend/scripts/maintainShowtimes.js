// backend/scripts/maintainShowtimes.js
import pool from '../db.js';

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
          inserts.push({
            movie_id: movie.id,
            start_time: getShowtimeDate(dayOffset, hour).toISOString()
          });
        }
      }
    }

    const values = inserts
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
      .join(', ');

    const params = [];
    inserts.forEach(({ movie_id, start_time }) => {
      params.push(movie_id, start_time);
    });

    await pool.query(
      `INSERT INTO showtimes (movie_id, start_time) VALUES ${values}`,
      params
    );

    console.log(`Inserted ${inserts.length} dummy showtimes`);
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
