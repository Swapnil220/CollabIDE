import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ErrorResponse} from '../utils/ErrorResponse.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User already exists', 400));
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('projects');
  
  res.status(200).json({
    success: true,
    user
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};