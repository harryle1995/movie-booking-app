import express from 'express';
import pool from '../db.js';

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

// ✅ GET /now-showing/:id/showtimes
router.get('/:id/showtimes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, start_time FROM showtimes WHERE movie_id = $1 ORDER BY start_time',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ GET /now-showing/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, duration, description, poster_url, genre FROM movies WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ PUT /now-showing/:id (admin edit)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, genre } = req.body;

  try {
    await pool.query(
      'UPDATE movies SET title=$1, description=$2, duration=$3, genre=$4 WHERE id=$5',
      [title, description, duration, genre, id]
    );
    res.json({ message: 'Movie updated' });
  } catch (err) {
    console.error('Error updating movie:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
