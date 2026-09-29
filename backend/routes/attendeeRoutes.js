import express from 'express';
import { 
    getAttendeeDashboardData, 
    getAllExpos, 
    bookTicket ,
    getExpoById,      
    getSessionsByExpo
} from '../controllers/bookingController.js';

const attendeeRoutes = express.Router();

attendeeRoutes.get('/dashboard/:attendeeId', getAttendeeDashboardData);

attendeeRoutes.get('/explore', getAllExpos);

attendeeRoutes.post('/register', bookTicket);

attendeeRoutes.get('/expo/:id', getExpoById); 
attendeeRoutes.get('/sessions/:id', getSessionsByExpo);
export default attendeeRoutes;