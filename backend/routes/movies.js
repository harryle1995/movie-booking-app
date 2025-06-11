import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET /now-showing
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, poster_url FROM movies');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ GET /now-showing/:id (movie details + showtimes)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get movie info
    const movieResult = await pool.query(
      'SELECT id, title, duration, description, poster_url, genre FROM movies WHERE id = $1',
      [id]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const movie = movieResult.rows[0];

    // 2. Get showtimes for that movie
    const showtimeResult = await pool.query(
      'SELECT id, start_time FROM showtimes WHERE movie_id = $1 ORDER BY start_time',
      [id]
    );

    // 3. Return combined data
    res.json({
      ...movie,
      showtimes: showtimeResult.rows,
    });
  } catch (err) {
    console.error('Error fetching movie or showtimes:', err);
    res.status(500).send('Server error');
  }
});

// ✅ POST /admin/editing/:id (Add movie)
router.post('/admin/editing', authenticateToken, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { title, description, duration, genre, poster_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO movies (title, description, duration, genre, poster_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, duration, genre, poster_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error adding new movie' });
  }
});

// ✅ PUT /admin/editing/:id (Edit movie)
router.put('/admin/editing/:id', authenticateToken, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  const { title, description, duration, genre, poster_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE movies SET title=$1, description=$2, duration=$3, genre=$4, poster_url=$5 WHERE id=$6 RETURNING *`,
      [title, description, duration, genre, poster_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// ✅ DELETE /admin/editing/:id (Delete movie)
router.delete('/admin/editing/:id', authenticateToken, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;

  try {
    // Delete related showtimes first if necessary (to satisfy foreign key)
    await pool.query('DELETE FROM showtimes WHERE movie_id = $1', [id]);

    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found or already deleted' });
    }

    res.json({ message: 'Movie deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

export default router;
