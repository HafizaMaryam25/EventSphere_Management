import express from 'express';
import { 
    submitFeedback, 
    getAllFeedbacks, 
    deleteFeedback, 
    updateFeedbackStatus  
} from '../controllers/feedbackController.js';

const router = express.Router();

// 1. Submit Combined Feedback (Text + Rating)
// User side se hit hoga
router.post('/submit', submitFeedback);

// 2. Get All Combined Feedbacks
// Admin dashboard ke liye jahan stars aur message dono dikhen ge
router.get('/all', getAllFeedbacks); 

// 3. Update Status (Pending -> Resolved)
router.put('/update-status/:id', updateFeedbackStatus);

// 4. Delete Feedback/Review
router.delete('/:id', deleteFeedback);

export default router;