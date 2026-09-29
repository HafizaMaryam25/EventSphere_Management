import express from 'express';
import { createExpo, deleteExpo, getAllExpos, getExpoById, updateExpo,getAllAttendees } from '../controllers/admincontroller.js';
import { protect, isAdmin } from '../middleware/authmiddleware.js';
import sessionRoutes from "./sessionRoutes.js";
import { getAnalyticsData } from '../controllers/analyticsController.js';


const adminRoutes = express.Router();

// Sirf Admin hi Expo create, update aur delete kar sakta hai
adminRoutes.post('/create', protect, isAdmin, createExpo); 
adminRoutes.put('/update/:id', protect, isAdmin, updateExpo);
adminRoutes.delete('/delete/:id', protect, isAdmin, deleteExpo); 
 
adminRoutes.get('/analytics', protect, isAdmin, getAnalyticsData);

// Expo dekhne ke liye security ki zaroorat nahi (ya agar chahiye toh protect laga sakti hain)
adminRoutes.get('/get', getAllExpos); 
adminRoutes.get('/get/:id', getExpoById);
adminRoutes.use('/manage', sessionRoutes);


adminRoutes.get('/all-attendees', getAllAttendees)

export default adminRoutes;