import Bookmark from '../models/Bookmark.js';

export const toggleBookmark = async (req, res) => {
  const { attendeeId, sessionId } = req.body;

  try {
    const existingBookmark = await Bookmark.findOne({ attendeeId, sessionId });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({ 
        success: true, 
        isBookmarked: false, 
        message: "Removed from bookmarks" 
      });
    } else {
      const newBookmark = new Bookmark({ attendeeId, sessionId });
      await newBookmark.save();
      return res.status(201).json({ 
        success: true, 
        isBookmarked: true, 
        message: "Added to bookmarks" 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookmarkedIds = async (req, res) => {
  const { attendeeId } = req.params;
  try {
    const bookmarks = await Bookmark.find({ attendeeId }).select('sessionId');
    const ids = bookmarks.map(b => b.sessionId);
    res.status(200).json(ids);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookmarkedDetails = async (req, res) => {
  const { attendeeId } = req.params;
  try {
    const bookmarks = await Bookmark.find({ attendeeId })
      .populate({
        path: 'sessionId',
        populate: { path: 'expoId', select: 'title' } // Expo ka naam bhi mil jayega
      });

    const sessionDetails = bookmarks.map(b => b.sessionId).filter(s => s != null);
    res.status(200).json(sessionDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};