import express from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
} from '../controllers/projectController.js';
import {protect} from '../middleware/authMiddleware.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {executeCode} from '../services/codeExecution.js'

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/collaborators')
  .post(protect, addCollaborator);

router.route('/:id/collaborators/:userId')
  .delete(protect, removeCollaborator);

// server/routes/projectRoutes.js
router.post('/:id/execute', 
    protect, // Your auth middleware
    asyncHandler(async (req, res) => {
      const { code, language } = req.body;
      const output = await executeCode(language, code);
      res.json({ output });
    })
  );

export default router;