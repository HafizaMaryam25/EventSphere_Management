import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['Attendee', 'Exhibitor', 'Admin'],
        default: 'Attendee' 
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;