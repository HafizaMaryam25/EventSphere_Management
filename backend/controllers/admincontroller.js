import Expo from "../models/Expo.js";
import Session from "../models/Session.js";
import Booking from "../models/Booking.js";
export const createExpo = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }
    const newExpo = new Expo(req.body); 
    await newExpo.save();
    res.status(201).json(newExpo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllExpos = async (req, res) => {
  try {
    const expos = await Expo.find().sort({ startDate: 1 });
    res.status(200).json(expos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpoById = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.status(200).json(expo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateExpo = async (req, res) => {
  try {
    const updatedExpo = await Expo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedExpo) return res.status(404).json({ message: "Expo not found!" });
    res.status(200).json(updatedExpo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteExpo = async (req, res) => {
  try {
    const deletedExpo = await Expo.findByIdAndDelete(req.params.id);
    if (!deletedExpo) return res.status(404).json({ message: "Expo not found!" });
    res.status(200).json({ message: "Expo deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const createSession = async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSession = await Session.findByIdAndDelete(id);

        if (!deletedSession) {
            return res.status(404).json({ message: "Session nahi mila" });
        }

        res.status(200).json({ message: "Session successfully delete ho gaya" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find({});
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateSession = async (req, res) => {
    try {
        // req.params.id check karein
        const session = await Session.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!session) return res.status(404).json({ message: "Session nahi mila" });
        
        res.status(200).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




export const getAllAttendees = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('attendeeId', 'name email')
            .populate('expoId', 'title') // Expo ka naam bhi le aate hain
            .sort({ bookedAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error: " + err.message });
    }
};