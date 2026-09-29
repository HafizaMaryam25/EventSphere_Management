import User from "../models/User.js";
import Expo from "../models/Expo.js";
import Booth from "../models/Booth.js";
import Session from "../models/Session.js";
import Booking from "../models/Booking.js";
import ExhibitorProfile from "../models/ExhibitorProfile.js";

export const getAnalyticsData = async (req, res) => {
  try {
    // ==================== 1. Summary Stats ====================
    const totalExpos = await Expo.countDocuments();
    const totalSessions = await Session.countDocuments();
    const totalAttendees = await User.countDocuments({ role: "Attendee" });
    const totalExhibitors = await User.countDocuments({ role: "Exhibitor" });
    const totalBookings = await Booking.countDocuments();

    // ==================== 2. Booth Status Distribution (Pie Chart) ====================
    const boothStatusAgg = await Booth.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const boothStatusData = boothStatusAgg.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // ==================== 3. Booth Category Distribution (Donut Chart) ====================
    const boothCategoryAgg = await Booth.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const boothCategoryData = boothCategoryAgg.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // ==================== 4. Expo-wise Booth Traffic (Bar Chart) ====================
    const expoBoothTraffic = await Booth.aggregate([
      {
        $lookup: {
          from: "expos",
          localField: "expoId",
          foreignField: "_id",
          as: "expo",
        },
      },
      { $unwind: "$expo" },
      {
        $group: {
          _id: "$expo.title",
          totalBooths: { $sum: 1 },
          bookedBooths: {
            $sum: {
              $cond: [
                { $in: ["$status", ["Booked", "Pending"]] },
                1,
                0,
              ],
            },
          },
          availableBooths: {
            $sum: {
              $cond: [{ $eq: ["$status", "Available"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { totalBooths: -1 } },
      { $limit: 8 },
    ]);

    const boothTrafficData = expoBoothTraffic.map((item) => ({
      name: item._id.length > 15 ? item._id.substring(0, 15) + "..." : item._id,
      total: item.totalBooths,
      booked: item.bookedBooths,
      available: item.availableBooths,
    }));

    // ==================== 5. Expo-wise Attendee Registrations (Bar Chart) ====================
    const expoRegistrations = await Booking.aggregate([
      {
        $lookup: {
          from: "expos",
          localField: "expoId",
          foreignField: "_id",
          as: "expo",
        },
      },
      { $unwind: "$expo" },
      {
        $group: {
          _id: "$expo.title",
          registrations: { $sum: 1 },
        },
      },
      { $sort: { registrations: -1 } },
      { $limit: 8 },
    ]);

    const attendeeEngagementData = expoRegistrations.map((item) => ({
      name: item._id.length > 15 ? item._id.substring(0, 15) + "..." : item._id,
      registrations: item.registrations,
    }));

    // ==================== 6. Sessions per Expo (Bar Chart) ====================
    const sessionPerExpo = await Session.aggregate([
      {
        $lookup: {
          from: "expos",
          localField: "expoId",
          foreignField: "_id",
          as: "expo",
        },
      },
      { $unwind: "$expo" },
      {
        $group: {
          _id: "$expo.title",
          sessions: { $sum: 1 },
        },
      },
      { $sort: { sessions: -1 } },
      { $limit: 8 },
    ]);

    const sessionPopularityData = sessionPerExpo.map((item) => ({
      name: item._id.length > 15 ? item._id.substring(0, 15) + "..." : item._id,
      sessions: item.sessions,
    }));

    // ==================== 7. Monthly Registration Trend (Line Chart) ====================
    const monthlyTrend = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$bookedAt" },
            month: { $month: "$bookedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const registrationTrend = monthlyTrend.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      registrations: item.count,
    }));

    // ==================== 8. User Role Distribution (Pie Chart) ====================
    const userRoleAgg = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const userRoleData = userRoleAgg.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // ==================== 9. Recent Activities ====================
    const recentBookings = await Booking.find()
      .populate("expoId", "title")
      .populate("attendeeId", "name")
      .sort({ bookedAt: -1 })
      .limit(5);

    const recentActivities = recentBookings.map((b) => ({
      user: b.attendeeId?.name || "Unknown",
      action: `Registered for ${b.expoId?.title || "an expo"}`,
      time: b.bookedAt,
    }));

    // ==================== RESPONSE ====================
    res.status(200).json({
      summary: {
        totalExpos,
        totalSessions,
        totalAttendees,
        totalExhibitors,
        totalBookings,
      },
      boothStatusData,
      boothCategoryData,
      boothTrafficData,
      attendeeEngagementData,
      sessionPopularityData,
      registrationTrend,
      userRoleData,
      recentActivities,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
};