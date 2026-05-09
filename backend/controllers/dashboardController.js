const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    // Get all projects the user is part of
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    const projectIds = projects.map(p => p._id);

    // Get task statistics
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });

    const statusCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    // My assigned tasks
    const myTasks = await Task.countDocuments({
      assignee: req.user._id,
      status: { $ne: 'completed' }
    });

    // Tasks completed this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const completedThisWeek = await Task.countDocuments({
      project: { $in: projectIds },
      status: 'completed',
      updatedAt: { $gte: weekAgo }
    });

    // Recent tasks
    const recentTasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignee', 'name email avatar')
      .populate('project', 'name')
      .sort({ updatedAt: -1 })
      .limit(10);

    const stats = {
      totalProjects: projects.length,
      totalTasks,
      myTasks,
      overdueTasks,
      completedThisWeek,
      statusBreakdown: {
        todo: 0,
        'in-progress': 0,
        review: 0,
        completed: 0
      },
      priorityBreakdown: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      recentTasks
    };

    statusCounts.forEach(sc => {
      stats.statusBreakdown[sc._id] = sc.count;
    });

    priorityCounts.forEach(pc => {
      stats.priorityBreakdown[pc._id] = pc.count;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue tasks
// @route   GET /api/dashboard/overdue
// @access  Private
const getOverdueTasks = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    });

    const projectIds = projects.map(p => p._id);

    const overdueTasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    })
      .populate('assignee', 'name email avatar')
      .populate('project', 'name')
      .populate('createdBy', 'name email avatar')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: overdueTasks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getOverdueTasks };
