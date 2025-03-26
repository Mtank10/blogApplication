import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadBlogImage } from '../middleware/upload.middleware.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();


router.route('/').get(catchAsync(getAllBlogs));
router.route('/:id').get(catchAsync(getBlog));


router.use(protect);

router.route('/').post(uploadBlogImage, catchAsync(createBlog));
router.route('/:id').patch(uploadBlogImage, catchAsync(updateBlog)).delete(catchAsync(deleteBlog));

export default router;