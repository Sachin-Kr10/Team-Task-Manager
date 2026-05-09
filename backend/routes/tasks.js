const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const { protect, projectMember } = require('../middleware/auth');

router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Task title is required')
      .isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),
    body('project').notEmpty().withMessage('Project is required')
  ],
  createTask
);

router.get('/my-tasks', protect, getMyTasks);
router.get('/project/:projectId', protect, projectMember, getProjectTasks);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
