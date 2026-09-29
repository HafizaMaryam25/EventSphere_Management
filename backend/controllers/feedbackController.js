import Feedback from "../models/FeedBack.js";
import Booking from "../models/Booking.js";

// 1. Submit Feedback (Already done, keeping it for context)
export const submitFeedback = async (req, res) => {
  try {
    const { userId, subject, message, targetId, rating } = req.body;

    if (!userId || !targetId || !message || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const isRegistered = await Booking.findOne({ attendeeId: userId, expoId: targetId });
    if (!isRegistered) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only give feedback for events you have registered for." 
      });
    }

    const existing = await Feedback.findOne({ userId, targetId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already reviewed this event." });
    }

    const newFeedback = new Feedback({
      userId,
      targetId,
      subject,
      message,
      rating: Number(rating),
      status: "Pending"
    });

    await newFeedback.save();
    res.status(201).json({ success: true, message: "Review submitted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Get All Feedbacks (For Admin)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name email'); // Optional: populate user details
    res.status(200).json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Update Status (Pending -> Resolved)
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id, 
      { status: "Resolved" }, 
      { new: true }
    );
    
    if (!updatedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Status updated!", data: updatedFeedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};