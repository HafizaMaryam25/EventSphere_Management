import express from 'express';
import { addBooths, bookBooth, deleteBooth, getAllBooths, getBoothsByExpo, getSingleBooth, updateBookingStatus, updateBooth } from '../controllers/boothcontroller.js';
import { protect, isAdmin, isExhibitor } from '../middleware/authmiddleware.js';

const boothrouter = express.Router();

// Admin Actions
boothrouter.post('/add-multiple', protect, isAdmin, addBooths);
boothrouter.delete('/delete/:id', protect, isAdmin, deleteBooth);
boothrouter.put('/update/:id', protect, isAdmin, updateBooth);
boothrouter.patch('/status/:id', protect, isAdmin, updateBookingStatus);

boothrouter.get('/expo/:expoId', getBoothsByExpo);
boothrouter.get('/all', getAllBooths);
boothrouter.get('/single/:id', getSingleBooth);

// Exhibitor Action (Changed to PATCH and :id for consistency)
boothrouter.patch('/book/:id', protect, isExhibitor, bookBooth);

export default boothrouter;