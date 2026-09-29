import Rating from "../models/Rating.js";
import Expo from "../models/Expo.js"; // Import important for validation or stats

// 1. Submit Rating (One Time per User per Expo)
export const submitRating = async (req, res) => {
  try {
    const { userId, targetId, score } = req.body;

    if (!userId || !targetId || !score) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // CHECK: Existing Rating
    const existingRating = await Rating.findOne({ userId, targetId });
    if (existingRating) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already rated this exhibition." 
      });
    }

    const newRating = new Rating({ userId, targetId, score });
    await newRating.save();

    res.status(201).json({ 
      success: true, 
      message: "Rating submitted successfully!", 
      data: newRating 
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate rating detected." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Get All Ratings (Admin Panel - Detailed View)
export const getAllRatings = async (req, res) => {
  try {
    // Admin ko expo ka title aur theme dono dikhane ke liye populate update kiya
    const allRatings = await Rating.find()
      .populate('userId', 'name email') 
      .populate('targetId', 'title theme location') 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allRatings.length,
      data: allRatings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Get Ratings for a Specific Expo
export const getExpoRatings = async (req, res) => {
  try {
    const { expoId } = req.params;
    const ratings = await Rating.find({ targetId: expoId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Get Average Rating & Count 
export const getExpoAverage = async (req, res) => {
  try {
    const { expoId } = req.params;
    const ratings = await Rating.find({ targetId: expoId });
    
    const avg = ratings.length > 0 
      ? (ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length).toFixed(1)
      : 0;

    res.status(200).json({ 
      success: true, 
      average: parseFloat(avg), 
      count: ratings.length 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- NAYA ADDITION FOR ADMIN DASHBOARD ---
// 5. Get Global Rating Stats (Summary for Admin)
export const getAdminRatingStats = async (req, res) => {
  try {
    const totalRatings = await Rating.countDocuments();
    
    // Aggregation to find average of ALL ratings across the platform
    const stats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          globalAverage: { $avg: "$score" },
          highestRating: { $max: "$score" }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      totalRatings,
      globalAverage: stats[0]?.globalAverage.toFixed(1) || 0,
      highestRating: stats[0]?.highestRating || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};