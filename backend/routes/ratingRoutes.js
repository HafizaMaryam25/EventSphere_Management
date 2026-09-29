import express from 'express';
import { 
  submitRating, 
  getExpoAverage, 
  getAllRatings, 
  getExpoRatings 
} from '../controllers/ratingController.js';

const router = express.Router();

// 1. Submit a new rating (Strictly One-Time per User/Expo)
router.post('/submit', submitRating);

// 2. Get average rating and count for a specific Expo (For display cards)
router.get('/average/:expoId', getExpoAverage);

// 3. Get ALL ratings across the platform (For Admin Overview)
router.get('/all', getAllRatings);

// 4. Get all individual ratings for a specific Expo (For detailed reports)
router.get('/expo/:expoId', getExpoRatings);

export default router;