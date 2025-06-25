import pool from '../../db/db.js'; // PostgreSQL connection pool

// ✅ Fetch list of movies for homepage or movie list
export const getAllMovies = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, poster_url FROM movies');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ✅ Fetch full details for a specific movie, including showtimes
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const movieResult = await pool.query(
      'SELECT id, title, duration, description, poster_url, genre FROM movies WHERE id = $1',
      [id]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = movieResult.rows[0];

    const showtimeResult = await pool.query(
      'SELECT id, start_time FROM showtimes WHERE movie_id = $1 ORDER BY start_time',
      [id]
    );

    res.json({
      ...movie,
      showtimes: showtimeResult.rows,
    });
  } catch (err) {
    console.error('Error fetching movie or showtimes:', err);
    res.status(500).send('Server error');
  }
};
