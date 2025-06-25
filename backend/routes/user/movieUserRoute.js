import express from 'express';
import { getAllMovies, getMovieDetails } from '../../controllers/user/movieUserController.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/:id', getMovieDetails);

export default router;
