import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/authController.js'; // <-- IMPORT loginUser

// Define the public registration route
router.post('/register', registerUser);

// Define the public login route
router.post('/login', loginUser); // <-- ADD this line

export default router;

