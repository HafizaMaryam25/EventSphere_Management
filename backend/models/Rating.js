import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exhibition', 
    required: true 
  }, 
  score: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
}, { timestamps: true });

// --- UNIQUE CONSTRAINT ---
// Ye line ensure karti hai ke 1 User + 1 Expo ka combo poore table mein sirf ek baar ho.
ratingSchema.index({ userId: 1, targetId: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);