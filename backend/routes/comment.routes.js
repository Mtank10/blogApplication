import express from 'express';
import {
  createComment,
  getCommentsForBlog,
  deleteComment,
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router
  .route('/:blogId/comments')
  .get(getCommentsForBlog)
  .post(protect, createComment);

router
  .route('/:blogId/comments/:commentId')
  .delete(protect, deleteComment);

export default router;