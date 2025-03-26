import prisma from '../config/db.js';
import AppError from '../utils/appError.js';


export const createBlog = async (req, res, next) => {
  try {
    const { title, description, content } = req.body;
    const image = req.file?.path;
    const userId = req.user.id;

    if (!title || !description || !content) {
      return next(new AppError('Please provide title, description and content', 400));
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        content,
        image,
        authorId: userId,
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
        blog,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profileImage: true,
          },
        },
        comments: {
          where: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profileImage: true,
          },
        },
        comments: {
          where: {
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
        },
      },
    });

    if (!blog) {
      return next(new AppError('No blog found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        blog,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateBlog = async (req,res,next) => {
  try {
    const { title, description, content } = req.body;
    const image = req.file?.path;
    const userId = req.user.id;

    const blog = await prisma.blog.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!blog) {
      return next(new AppError('No blog found with that ID', 404));
    }

    if (blog.authorId !== userId) {
      return next(new AppError('You are not authorized to update this blog', 403));
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: title || blog.title,
        description: description || blog.description,
        content: content || blog.content,
        image: image || blog.image,
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

    res.status(200).json({
      status: 'success',
      data: {
        blog: updatedBlog,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req,res,next) => {
  try {
    const userId = req.user.id;

    const blog = await prisma.blog.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!blog) {
      return next(new AppError('No blog found with that ID', 404));
    }

    if (blog.authorId !== userId) {
      return next(new AppError('You are not authorized to delete this blog', 403));
    }

    await prisma.blog.delete({
      where: {
        id: req.params.id,
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