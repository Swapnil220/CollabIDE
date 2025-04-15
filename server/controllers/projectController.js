import Project from '../models/Project.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ErrorResponse} from '../utils/ErrorResponse.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req, res, next) => {
  const { name, description, language, initialCode } = req.body;

  console.log(req,'reqqqqqqqqqqqqqqqqqq')

  const project = await Project.create({
    name,
    description,
    language,
    initialCode,
    currentCode: initialCode,
    owner: req.user.id
  });

  // Add project to user's projects
  await User.findByIdAndUpdate(req.user.id, {
    $push: { projects: project._id }
  });

  res.status(201).json({
    success: true,
    project
  });
});

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
export const getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user.id },
      { 'collaborators.user': req.user.id }
    ]
  }).populate('owner', 'username email');

  res.status(200).json({
    success: true,
    count: projects.length,
    projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    $or: [
      { owner: req.user.id },
      { 'collaborators.user': req.user.id }
    ]
  }).populate('owner collaborators.user', 'username email');

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  res.status(200).json({
    success: true,
    project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this project', 401));
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this project', 401));
  }

  await project.remove();

  // Remove project from user's projects
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { projects: project._id }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add collaborator to project
// @route   POST /api/projects/:id/collaborators
// @access  Private
export const addCollaborator = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to add collaborators', 401));
  }

  // Check if user is already a collaborator
  const existingCollaborator = project.collaborators.find(
    collab => collab.user.toString() === userId
  );

  if (existingCollaborator) {
    return next(new ErrorResponse('User is already a collaborator', 400));
  }

  project.collaborators.push({ user: userId, role });
  await project.save();

  res.status(200).json({
    success: true,
    project
  });
});

// @desc    Remove collaborator from project
// @route   DELETE /api/projects/:id/collaborators/:userId
// @access  Private
export const removeCollaborator = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to remove collaborators', 401));
  }

  project.collaborators = project.collaborators.filter(
    collab => collab.user.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({
    success: true,
    project
  });
});