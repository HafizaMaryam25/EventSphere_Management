import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookmarkSchema.index({ attendeeId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);