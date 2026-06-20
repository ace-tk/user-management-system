import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

// Wrap async functions to safely catch unhandled promise rejections
router.post('/', (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

export default router;
