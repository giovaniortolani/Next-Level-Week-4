import { Router } from 'express';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();

// Quando fizermos um POST para /users iremos executar a callback.
router.post('/users', userController.create);

export { router };