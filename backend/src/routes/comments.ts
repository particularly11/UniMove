import { Router } from 'express';
import { CommentController } from '../controllers/CommentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 公开路由
router.get('/activity/:activityId', CommentController.getActivityComments);

// 需要认证的路由
router.post('/', authenticateToken, CommentController.createComment);
router.get('/my', authenticateToken, CommentController.getUserComments);
router.put('/:id', authenticateToken, CommentController.updateComment);
router.delete('/:id', authenticateToken, CommentController.deleteComment);

export default router;
