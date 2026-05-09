const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (project admin)
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { title, description, project, assignee, priority, dueDate, tags } = req.body;

    // Verify project exists and user has access
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const isOwner = proj.owner.toString() === req.user._id.toString();
    const memberEntry = proj.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberEntry && memberEntry.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only project admins can create tasks'
      });
    }

    // If assignee provided, verify they are a project member
    if (assignee) {
      const isMember = proj.members.some(
        m => m.user.toString() === assignee
      );
      if (!isMember && proj.owner.toString() !== assignee) {
        return res.status(400).json({
          success: false,
          message: 'Assignee must be a project member'
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignee: assignee || null,
      createdBy: req.user._id,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || []
    });

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name');

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private (project member)
const getProjectTasks = async (req, res, next) => {
  try {
    const { status, priority, assignee, sort = '-createdAt' } = req.query;

    const filter = { project: req.params.projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort(sort);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's assigned tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res, next) => {
  try {
    const { status, priority, sort = '-createdAt' } = req.query;

    const filter = { assignee: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name')
      .sort(sort);

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (admin or assignee)
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberEntry && memberEntry.role === 'admin';
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Members (assignees) can only update status
    if (!isOwner && !isAdmin && isAssignee) {
      const allowedFields = ['status'];
      const updateKeys = Object.keys(req.body);
      const hasDisallowedFields = updateKeys.some(k => !allowedFields.includes(k));
      if (hasDisallowedFields) {
        return res.status(403).json({
          success: false,
          message: 'You can only update the task status'
        });
      }
    }

    const { title, description, assignee, status, priority, dueDate, tags } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;

    await task.save();

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name');

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
// @access  Private (assignee or admin)
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['todo', 'in-progress', 'review', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberEntry && memberEntry.role === 'admin';
    const isAssignee = task.assignee && task.assignee.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    task.status = status;
    await task.save();

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name');

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (admin)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check admin permissions
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const memberEntry = project.members.find(
      m => m.user.toString() === req.user._id.toString()
    );
    const isAdmin = memberEntry && memberEntry.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete tasks'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
