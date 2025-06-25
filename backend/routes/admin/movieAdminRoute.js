import express from 'express';
import { authenticateToken } from '../../middleware/authMiddleware.js'; // Middleware for JWT verification
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '../../controllers/admin/movieAdminController.js';

const router = express.Router();

// 🟢 [ADMIN ONLY] Get all movies for admin editing dashboard
router.get('/', authenticateToken, getAllMovies);

// 🟢 [ADMIN ONLY] Add a new movie
router.post('/', authenticateToken, addMovie);

// 🟢 [ADMIN ONLY] Update an existing movie by ID
router.put('/:id', authenticateToken, updateMovie);

// 🟢 [ADMIN ONLY] Delete a movie by ID
router.delete('/:id', authenticateToken, deleteMovie);

export default router;
