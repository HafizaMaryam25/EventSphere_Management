import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userModel: { type: String, default: 'User' },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibition' }, // Event reference
  subject: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Added Rating here
  status: { type: String, default: 'Pending', enum: ['Pending', 'Reviewed', 'Resolved'] }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);