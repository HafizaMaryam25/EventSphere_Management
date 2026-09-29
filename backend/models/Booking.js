import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
    ticketType: { type: String, default: "General Admission" },
    qrCode: { type: String }, 
    bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);