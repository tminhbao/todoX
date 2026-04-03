import express from 'express';
import { createNewTask, deleteTask, getAllTasks, updateTask } from '../controllers/taskControllers.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createNewTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;

