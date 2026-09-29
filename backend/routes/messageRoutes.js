import express from 'express';
import { sendMessage, getChatHistory, getConversations, markAsRead, getAdminDetails } from '../controllers/messageController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/conversations/:userId', getConversations);
router.get('/history/:myId/:otherId', getChatHistory);
router.put('/read/:myId/:otherId', markAsRead);
router.get('/admin-details', getAdminDetails); // New Route

export default router;