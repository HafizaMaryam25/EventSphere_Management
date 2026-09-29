import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const getAdminDetails = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'Admin' }).select('_id name role');
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, senderModel, receiverModel, text } = req.body;
    
    // Strict Validation: Admin hamesha 'User' collection mein hota hai
    const finalSenderModel = senderModel === 'Admin' ? 'User' : senderModel;
    const finalReceiverModel = receiverModel === 'Admin' ? 'User' : receiverModel;

    const newMessage = new Message({
      senderId,
      receiverId,
      senderModel: finalSenderModel,
      receiverModel: finalReceiverModel,
      text
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send Error:", err);
    res.status(500).json({ message: "Failed to send", error: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Message.aggregate([
      { $match: { $or: [{ senderId: userObjectId }, { receiverId: userObjectId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$senderId", userObjectId] }, "$receiverId", "$senderId"] },
          lastMessage: { $first: "$text" },
          lastMessageDate: { $first: "$createdAt" },
          senderModel: { $first: "$senderModel" },
          receiverModel: { $first: "$receiverModel" }
        }
      },
      { $sort: { lastMessageDate: -1 } }
    ]);

    const populatedConversations = await Promise.all(
      conversations.map(async (convo) => {
        // Pehle User collection mein check karo
        let details = await User.findById(convo._id).select('name role email').lean();
        
        // Agar wahan nahi mila, toh Exhibitor collection mein check karo
        if (!details) {
          const Exhibitor = mongoose.model('Exhibitor');
          details = await Exhibitor.findById(convo._id).select('companyName name role').lean();
          if (details) details.name = details.companyName || details.name; // WhatsApp style name logic
        }
        
        return { ...convo, contactDetails: details };
      })
    );
    res.status(200).json(populatedConversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { myId, otherId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { senderId: otherId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { myId, otherId } = req.params;
    await Message.updateMany(
      { senderId: otherId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};