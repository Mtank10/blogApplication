import { hashPassword, comparePasswords } from '../utils/bcrypt.js';
import { signToken } from '../utils/jwt.js';
import prisma from '../config/db.js';
import AppError from '../utils/appError.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const profileImage = req.file?.path;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profileImage,
      },
      select: {
        id: true,
        email: true,
        profileImage: true,
        createdAt: true
      }
    });

    const token = signToken(user.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      return next(new AppError('Email already exists', 400));
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePasswords(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add this new endpoint
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    next(err);
  }
};