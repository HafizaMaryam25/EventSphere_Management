import express from 'express';
import { toggleBookmark, getMyBookmarkedIds, getMyBookmarkedDetails } from '../controllers/BookmarkController.js';

const router = express.Router();

router.post('/toggle', toggleBookmark);
router.get('/my-ids/:attendeeId', getMyBookmarkedIds);
router.get('/details/:attendeeId', getMyBookmarkedDetails);
export default router;