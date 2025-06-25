// controllers/admin/movieAdminController.js
import pool from '../../db/db.js';

export const getAllMovies = async (req, res) => {
  console.log('Request hit /admin/editing with user:', req.user);
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMovie = async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { title, description, duration, genre, poster_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO movies (title, description, duration, genre, poster_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, duration, genre, poster_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding movie' });
  }
};

export const updateMovie = async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  const { title, description, duration, genre, poster_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE movies SET title=$1, description=$2, duration=$3, genre=$4, poster_url=$5 WHERE id=$6 RETURNING *',
      [title, description, duration, genre, poster_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating movie' });
  }
};

export const deleteMovie = async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Forbidden' });

  const { id } = req.params;
  try {
    await pool.query('DELETE FROM movies WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting movie' });
  }
};
