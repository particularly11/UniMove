import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 所有订单路由都需要认证
router.post('/', authenticateToken, OrderController.createOrder);
router.get('/', authenticateToken, OrderController.getUserOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);
router.put('/:id/pay', authenticateToken, OrderController.payOrder);
router.put('/:id/cancel', authenticateToken, OrderController.cancelOrder);
router.get('/activity/:activityId', authenticateToken, OrderController.getActivityOrders);

export default router;
