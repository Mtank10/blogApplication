import express from 'express';
import {
  signup,
  login,
  getMe
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadUserPhoto } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/signup', uploadUserPhoto, signup);
router.post('/login', login);
router.get('/me', protect, getMe); 

export default router;
