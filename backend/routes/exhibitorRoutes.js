import express from "express";

import {
  updateExhibitorProfile,
  getMyProfile,
  getAllExhibitors,
} from "../controllers/exhibitorcontroller.js";

import {
  protect,
  isExhibitor,
  isAdmin,
} from "../middleware/authmiddleware.js";

import { upload } from "../middleware/uploadMiddleware.js";

const exhibitorRoute = express.Router();

const cpUpload = upload.fields([
  {
    name: "logo",
    maxCount: 1,
  },
  {
    name: "productImages",
    maxCount: 10,
  },
  {
    name: "documents",
    maxCount: 10,
  },
]);

exhibitorRoute.post(
  "/update-profile",
  protect,
  isExhibitor,
  cpUpload,
  updateExhibitorProfile
);

exhibitorRoute.get(
  "/my-profile",
  protect,
  isExhibitor,
  getMyProfile
);

exhibitorRoute.get(
  "/all-exhibitors",
  protect,
  isAdmin,
  getAllExhibitors
);

export default exhibitorRoute;