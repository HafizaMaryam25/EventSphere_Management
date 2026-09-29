import mongoose from "mongoose";

const expoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // Date ko do hisson mein divide kar diya gaya hai
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true }, 
  location: { type: String, required: true }, 
  description: { type: String }, 
  theme: { type: String }
  // boothAllocation yahan se hata diya gaya hai
}, { timestamps: true });

const Expo = mongoose.model("Expo", expoSchema);
export default Expo;