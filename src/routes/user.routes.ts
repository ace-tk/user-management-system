import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

const router = Router();

// Wrap async functions to safely catch unhandled promise rejections
router.post('/', validate(createUserSchema), (req, res, next) => {
  userController.createUser(req, res).catch(next);
});

router.get('/', (req, res, next) => {
  userController.getUsers(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  userController.getUser(req, res).catch(next);
});

router.put('/:id', validate(updateUserSchema), (req, res, next) => {
  userController.updateUser(req, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  userController.deleteUser(req, res).catch(next);
});

export default router;
