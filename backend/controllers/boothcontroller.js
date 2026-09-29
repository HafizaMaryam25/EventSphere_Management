import Booth from "../models/Booth.js";
import ExhibitorProfile from "../models/ExhibitorProfile.js";
import { createNotification } from "./notificationController.js"; 

export const addBooths = async (req, res) => {
  try {
    const { expoId, booths } = req.body;
    if (!expoId || !booths || booths.length === 0) return res.status(400).json({ message: "Invalid data" });
    const formattedBooths = booths.map(booth => ({ ...booth, expoId }));
    const newBooths = await Booth.insertMany(formattedBooths);

    // Notification Logic
    const notification = await createNotification({
      recipient: req.user._id,
      title: "Booths Added",
      message: `${newBooths.length} new booths have been added to the Expo.`,
      type: "success"
    });
    if (req.io) req.io.to(req.user._id.toString()).emit("new_notification", notification);

    res.status(201).json({ message: "Booths added", data: newBooths });
  } catch (error) { res.status(500).json({ message: "Server Error", error: error.message }); }
};

export const getBoothsByExpo = async (req, res) => {
  try {
    const booths = await Booth.find({ expoId: req.params.expoId });
    const boothsWithDetails = await Promise.all(booths.map(async (booth) => {
      const boothObj = booth.toObject();
      if (booth.bookedBy && booth.status === 'Booked') {
        const profile = await ExhibitorProfile.findOne({ userId: booth.bookedBy });
        if (profile) {
          boothObj.companyName = profile.companyName;
          boothObj.industry = profile.industry;
          boothObj.logo = profile.logo;
        }
      }
      return boothObj;
    }));
    res.status(200).json(boothsWithDetails);
  } catch (error) { res.status(500).json({ message: "Error", error: error.message }); }
};

export const getAllBooths = async (req, res) => {
  try {
    const { expoId, status } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;
    if (status) query.status = status;

    const booths = await Booth.find(query).populate('expoId', 'title');
    const boothsWithDetails = await Promise.all(booths.map(async (booth) => {
      const boothObj = booth.toObject();
      if (booth.bookedBy) {
        const profile = await ExhibitorProfile.findOne({ userId: booth.bookedBy });
        boothObj.companyName = profile ? profile.companyName : "Individual";
      }
      return boothObj;
    }));
    res.status(200).json(boothsWithDetails);
  } catch (error) { res.status(500).json({ message: "Error", error: error.message }); }
};

export const getSingleBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id).populate('expoId', 'title');
    res.status(200).json(booth);
  } catch (error) { res.status(500).json({ message: "Error", error: error.message }); }
};

export const updateBooth = async (req, res) => {
  try {
    const updated = await Booth.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    
    // Notification Logic
    const notification = await createNotification({
      recipient: req.user._id,
      title: "Booth Updated",
      message: `Booth ${updated.number || ""} details have been modified.`,
      type: "info"
    });
    if (req.io) req.io.to(req.user._id.toString()).emit("new_notification", notification);

    res.status(200).json(updated);
  } catch (error) { res.status(500).json({ message: "Update failed", error: error.message }); }
};

export const deleteBooth = async (req, res) => {
  try {
    await Booth.findByIdAndDelete(req.params.id);

    // Notification Logic
    const notification = await createNotification({
      recipient: req.user._id,
      title: "Booth Deleted",
      message: `A booth was successfully removed from the system.`,
      type: "warning"
    });
    if (req.io) req.io.to(req.user._id.toString()).emit("new_notification", notification);

    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ message: "Delete failed", error: error.message }); }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; 

    const booth = await Booth.findById(id);
    if (!booth) return res.status(404).json({ message: "Booth not found" });

    if (action === 'approve') {
      booth.status = 'Booked'; 
    } else if (action === 'reject') {
      booth.status = 'Rejected'; 
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await booth.save();

    // Notification Logic (Exhibitor ko bhejne ke liye jisne book kiya tha)
    if (booth.bookedBy) {
        const notification = await createNotification({
          recipient: booth.bookedBy, // Exhibitor ko notification jayegi
          title: `Booking ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          message: `Your booking request for Booth ${booth.number || ""} has been ${action}ed.`,
          type: action === 'approve' ? "success" : "error"
        });
        if (req.io) req.io.to(booth.bookedBy.toString()).emit("new_notification", notification);
    }

    res.status(200).json({ message: `Successfully ${action}ed`, data: booth });
  } catch (error) {
    res.status(500).json({ message: "Action failed", error: error.message });
  }
};

export const bookBooth = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    
    if (!booth || (booth.status !== 'Available' && booth.status !== 'Rejected')) {
        return res.status(400).json({ message: "Booth is already booked or pending" });
    }

    booth.status = 'Pending';
    booth.bookedBy = req.user._id; 
    await booth.save();

 
    const notification = await createNotification({
      recipient: req.user._id, 
      title: "Booking Request Sent",
      message: `Your request for Booth ${booth.number || ""} is now pending approval.`,
      type: "info"
    });
    if (req.io) req.io.to(req.user._id.toString()).emit("new_notification", notification);

    res.status(200).json({ message: "Request sent!" });
  } catch (error) { res.status(500).json({ message: "Booking failed", error: error.message }); }
};