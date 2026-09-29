    import express from "express";
    import {  createSession,updateSession, getAllSessions,deleteSession } from "../controllers/admincontroller.js";
    import { protect, isAdmin } from "../middleware/authmiddleware.js";

    const sessionRoutes = express.Router();



    sessionRoutes.post("/sessions", protect, isAdmin, createSession);
    sessionRoutes.patch("/sessions/:id", protect, isAdmin, updateSession);
sessionRoutes.get("/sessions", getAllSessions);
sessionRoutes.delete("/sessions/:id", protect, isAdmin, deleteSession);
    export default sessionRoutes;