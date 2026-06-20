import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema } from '../validations/user.validation';

const router = Router();

// Wrap async functions to safely catch unhandled promise rejections
router.post('/', validate(createUserSchema), (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

router.get('/', (req, res, next) => {
  userController.getUsers(req, res).catch(next);
});

export default router;
