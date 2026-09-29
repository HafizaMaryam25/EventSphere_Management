import Booking from "../models/Booking.js";
import Expo from "../models/Expo.js";
import Session from "../models/Session.js"; // Isko check kar lena agar model name different ho

// 1. Dashboard Data
export const getAttendeeDashboardData = async (req, res) => {
    try {
        const { attendeeId } = req.params;
        
        const registeredCount = await Booking.countDocuments({ attendeeId });

        const upcomingExpos = await Booking.find({ attendeeId })
            .populate('expoId')
            .sort({ bookedAt: -1 })
            .limit(3);

        res.status(200).json({
            stats: {
                registeredExpos: registeredCount,
                savedBooths: 12, 
                messagesSent: 8,
                experiencePoints: 450
            },
            upcomingExpos
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Get All Expos (Explore Page)
export const getAllExpos = async (req, res) => {
    try {
        const { search } = req.query; // Yeh line lazmi honi chahiye
        let query = {};

        if (search) {
            // Yeh logic backend ko batati hai ke search term title ya theme mein dhundo
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { theme: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const expos = await Expo.find(query).sort({ startDate: 1 });
        res.status(200).json(expos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// 3. Get Single Expo Details (Fix for "Expo Not Found")
export const getExpoById = async (req, res) => {
    try {
        const { id } = req.params;
        const expo = await Expo.findById(id);
        
        if (!expo) {
            return res.status(404).json({ message: "Exhibition not found" });
        }
        
        res.status(200).json(expo);
    } catch (err) {
        // Agar ID ka format ghalat ho (invalid ObjectId)
        res.status(400).json({ message: "Invalid Exhibition ID format" });
    }
};

// 4. Get Sessions for a specific Expo
export const getSessionsByExpo = async (req, res) => {
    try {
        const { id } = req.params; // Ye expoId hai
        // Session model mein 'expoId' field honi chahiye jo Exhibition se link ho
        const sessions = await Session.find({ expoId: id }).sort({ startTime: 1 });
        
        res.status(200).json(sessions || []);
    } catch (err) {
        res.status(500).json({ message: "Error fetching sessions" });
    }
};

// 5. Book Ticket / Register
export const bookTicket = async (req, res) => {
    try {
        const { attendeeId, expoId } = req.body;
        
        const existing = await Booking.findOne({ attendeeId, expoId });
        if (existing) {
            return res.status(400).json({ message: "You are already registered for this expo!" });
        }

        const newBooking = new Booking({ 
            attendeeId, 
            expoId, 
            qrCode: `TIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
        });

        await newBooking.save();
        res.status(201).json({ message: "Registered successfully!", newBooking });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

