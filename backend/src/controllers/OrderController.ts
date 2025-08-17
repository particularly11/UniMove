import { Response } from 'express';
import { Order, IOrder } from '../models/Order';
import { Activity } from '../models/Activity';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export class OrderController {
  // 创建订单
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { activityId } = req.body;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        res.status(400).json({
          success: false,
          message: '无效的活动ID'
        });
        return;
      }

      const activity = await Activity.findById(activityId);

      if (!activity) {
        res.status(404).json({
          success: false,
          message: '活动不存在'
        });
        return;
      }

      // 检查活动状态
      if (activity.status !== 'published') {
        res.status(400).json({
          success: false,
          message: '活动不可预订'
        });
        return;
      }

      // 检查是否已有订单
      const existingOrder = await Order.findOne({
        user: userId,
        activity: activityId,
        status: { $in: ['pending', 'paid'] }
      });

      if (existingOrder) {
        res.status(400).json({
          success: false,
          message: '您已有此活动的订单'
        });
        return;
      }

      // 检查人数限制
      if (activity.currentParticipants >= activity.maxParticipants) {
        res.status(400).json({
          success: false,
          message: '活动人数已满'
        });
        return;
      }

      // 创建订单
      const order: IOrder = new Order({
        user: userId,
        activity: activityId,
        amount: activity.price,
        status: 'paid' // 直接设置为已支付状态，简化流程
      });

      await order.save();

      // 更新活动参与信息
      await Activity.findByIdAndUpdate(activityId, {
        $inc: { currentParticipants: 1 },
        $addToSet: { participants: userId }
      });

      await order.populate([
        { path: 'user', select: 'username email' },
        { path: 'activity', select: 'title startTime endTime location price' }
      ]);

      res.status(201).json({
        success: true,
        message: '报名成功！',
        data: { order }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '订单创建失败'
      });
    }
  }

  // 获取用户订单列表
  static async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { page = 1, limit = 10, status } = req.query;

      const query: any = { user: userId };
      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('activity', 'title startTime endTime location price images')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Order.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            current: Number(page),
            total: Math.ceil(total / Number(limit)),
            count: total
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取订单列表失败'
      });
    }
  }

  // 获取订单详情
  static async getOrderById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: '无效的订单ID'
        });
        return;
      }

      const order = await Order.findById(id)
        .populate('user', 'username email phone')
        .populate('activity', 'title description startTime endTime location price images organizer')
        .populate('activity.organizer', 'username phone');

      if (!order) {
        res.status(404).json({
          success: false,
          message: '订单不存在'
        });
        return;
      }

      // 检查权限
      if (order.user._id.toString() !== userId && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: '无权查看此订单'
        });
        return;
      }

      res.json({
        success: true,
        data: { order }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取订单详情失败'
      });
    }
  }

  // 支付订单
  static async payOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { paymentMethod } = req.body;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: '无效的订单ID'
        });
        return;
      }

      const order = await Order.findById(id).populate('activity');

      if (!order) {
        res.status(404).json({
          success: false,
          message: '订单不存在'
        });
        return;
      }

      // 检查权限
      if (order.user.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: '无权操作此订单'
        });
        return;
      }

      // 检查订单状态
      if (order.status !== 'pending') {
        res.status(400).json({
          success: false,
          message: '订单状态不正确'
        });
        return;
      }

      // 检查活动是否还有名额
      const activity = await Activity.findById(order.activity);
      if (!activity || activity.currentParticipants >= activity.maxParticipants) {
        res.status(400).json({
          success: false,
          message: '活动人数已满'
        });
        return;
      }

      // 模拟支付成功（实际项目中需要对接支付网关）
      order.status = 'paid';
      order.paymentMethod = paymentMethod;
      order.paymentTime = new Date();
      await order.save();

      // 更新活动参与人数
      if (!activity.participants.includes(userId as any)) {
        activity.participants.push(userId as any);
        activity.currentParticipants += 1;
        await activity.save();
      }

      res.json({
        success: true,
        message: '支付成功',
        data: { order }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '支付失败'
      });
    }
  }

  // 取消订单
  static async cancelOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: '无效的订单ID'
        });
        return;
      }

      const order = await Order.findById(id).populate('activity');

      if (!order) {
        res.status(404).json({
          success: false,
          message: '订单不存在'
        });
        return;
      }

      // 检查权限
      if (order.user.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: '无权操作此订单'
        });
        return;
      }

      // 检查订单状态
      if (order.status === 'cancelled') {
        res.status(400).json({
          success: false,
          message: '订单已取消'
        });
        return;
      }

      // 如果是已支付订单，需要退款
      if (order.status === 'paid') {
        const activity = order.activity as any;
        
        // 检查是否可以取消（活动开始前24小时）
        const hoursUntilStart = (activity.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        if (hoursUntilStart < 24) {
          res.status(400).json({
            success: false,
            message: '活动开始前24小时内不可取消'
          });
          return;
        }

        // 模拟退款处理
        order.status = 'refunded';
        order.refundAmount = order.amount;
        order.refundTime = new Date();
        
        // 更新活动参与人数
        const activityDoc = await Activity.findById(activity._id);
        if (activityDoc) {
          activityDoc.participants = activityDoc.participants.filter(
            participant => participant.toString() !== userId
          );
          activityDoc.currentParticipants -= 1;
          await activityDoc.save();
        }
      } else {
        order.status = 'cancelled';
      }

      order.cancelReason = reason || '用户取消';
      await order.save();

      res.json({
        success: true,
        message: '订单取消成功',
        data: { order }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '订单取消失败'
      });
    }
  }

  // 获取活动的订单列表（组织者使用）
  static async getActivityOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { activityId } = req.params;
      const userId = req.user?.userId;
      const { page = 1, limit = 10, status } = req.query;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        res.status(400).json({
          success: false,
          message: '无效的活动ID'
        });
        return;
      }

      // 检查活动是否存在且用户是组织者
      const activity = await Activity.findById(activityId);
      if (!activity) {
        res.status(404).json({
          success: false,
          message: '活动不存在'
        });
        return;
      }

      if (activity.organizer.toString() !== userId && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: '无权查看此活动的订单'
        });
        return;
      }

      const query: any = { activity: activityId };
      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [orders, total] = await Promise.all([
        Order.find(query)
          .populate('user', 'username email phone avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Order.countDocuments(query)
      ]);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            current: Number(page),
            total: Math.ceil(total / Number(limit)),
            count: total
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '获取活动订单失败'
      });
    }
  }
}
