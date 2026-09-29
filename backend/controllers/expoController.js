import Expo from "../models/Expo.js";

export const getAllExpos = async (req, res) => {
  try {
    // Humne filter hata diya taake expired expos bhi frontend ko milen
    // Hum sort kar rahe hain taake naye expos pehle nazar aaein
    const expos = await Expo.find().sort({ startDate: -1 }); 

    res.status(200).json(expos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};