import prisma from '../config/db.js';
import AppError from '../utils/appError.js';

export const createComment = async (req,res,next) => {
  try {
    const { content, parentId } = req.body;
    const userId = req.user.id;
    const blogId = req.params.blogId;

    if (!content) {
      return next(new AppError('Please provide comment content', 400));
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        blogId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getCommentsForBlog = async (req,res,next) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId: req.params.blogId,
        parentId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profileImage: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req,res,next) => {
  try {
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
    });

    if (!comment) {
      return next(new AppError('No comment found with that ID', 404));
    }

    if (comment.authorId !== userId) {
      return next(new AppError('You are not authorized to delete this comment', 403));
    }

    await prisma.comment.delete({
      where: {
        id: req.params.commentId,
      },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};