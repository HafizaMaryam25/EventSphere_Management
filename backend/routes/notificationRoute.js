import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authmiddleware.js';

const notificationRoutes = express.Router();

notificationRoutes.get('/', protect, getNotifications);
notificationRoutes.put('/:id/read', protect, markAsRead);
notificationRoutes.put('/read-all', protect, markAllAsRead);

export default notificationRoutes;
