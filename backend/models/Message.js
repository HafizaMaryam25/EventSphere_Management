import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'senderModel' // Ye dynamic reference hai
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'receiverModel' 
  },
  senderModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Exhibitor', 'Admin'] // In teeno roles mein se koi bhi ho sakta hai
  },
  receiverModel: { 
    type: String, 
    required: true, 
    enum: ['User', 'Exhibitor', 'Admin'] 
  },
  text: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;