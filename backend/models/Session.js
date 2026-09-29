import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  expoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expo', 
    required: true 
  },
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: String, required: true }, 
  description: { type: String }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;