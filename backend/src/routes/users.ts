import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 公开路由
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// 需要认证的路由
router.use(authenticateToken);
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/password', UserController.changePassword);

export default router;
