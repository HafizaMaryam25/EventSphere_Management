import express from 'express';
import { signup, login, getUserProfile } from '../controllers/authcontroller.js';

const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/login', login);
authrouter.get("/profile/:id", getUserProfile)

export default authrouter;