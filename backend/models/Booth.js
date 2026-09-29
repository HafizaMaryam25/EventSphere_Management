import mongoose from "mongoose";

const boothSchema = new mongoose.Schema({
  expoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expo', 
    required: true 
  },
  boothNumber: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Standard', 'Premium', 'VIP'], 
    default: 'Standard' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Pending', 'Booked', 'Rejected'], // 'Rejected' ADDED HERE
    default: 'Available' 
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

export default mongoose.model("Booth", boothSchema);