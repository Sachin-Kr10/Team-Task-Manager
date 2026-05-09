const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    });
  }
};

// Check if user is admin of a project
const projectAdmin = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.id || req.params.projectId || req.body.project;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberEntry && memberEntry.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only project admins can perform this action'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

// Check if user is a member of a project
const projectMember = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.id || req.params.projectId || req.body.project;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this project'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, projectAdmin, projectMember };
