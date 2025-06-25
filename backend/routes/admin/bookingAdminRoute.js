import express from 'express';
import { getAllBookings } from '../../controllers/admin/bookingAdminController.js';
import { authenticateToken, requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/* ------------------ GET ALL BOOKINGS - ADMIN ONLY ------------------ */
router.get('/', authenticateToken, requireAdmin, getAllBookings);

export default router;
