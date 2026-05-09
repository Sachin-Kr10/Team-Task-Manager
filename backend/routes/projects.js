const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { protect, projectAdmin } = require('../middleware/auth');

router.route('/')
  .get(protect, getProjects)
  .post(
    protect,
    [
      body('name').trim().notEmpty().withMessage('Project name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    ],
    createProject
  );

router.route('/:id')
  .get(protect, getProject)
  .put(protect, projectAdmin, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/members', protect, projectAdmin, addMember);
router.delete('/:id/members/:userId', protect, projectAdmin, removeMember);

module.exports = router;
