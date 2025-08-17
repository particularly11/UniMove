import { Response } from 'express';
import { Comment, IComment } from '../models/Comment';
import { Activity } from '../models/Activity';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export class CommentController {
  // 创建评论
  static async createComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { activityId, content, rating, images } = req.body;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        res.status(400).json({
          success: false,
          message: '无效的活动ID'
        });
        return;
      }

      // 检查活动是否存在
      const activity = await Activity.findById(activityId);
      if (!activity) {
        res.status(404).json({
          success: false,
          message: '活动不存在'
        });
        return;
      }

      // 检查用户是否参加过此活动
      const order = await Order.findOne({
        user: userId,
        activity: activityId,
        status: 'paid'
      });

      if (!order) {
        res.status(403).json({
          success: false,
          message: '只有参加过活动的用户才能评论'
        });
        return;
      }

      // 移除活动结束时间检查，允许参加后立即评论
      // 检查是否已评论过
      const existingComment = await Comment.findOne({
        user: userId,
        activity: activityId
      });

      if (existingComment) {
        res.status(400).json({
          success: false,
          message: '您已评论过此活动'
        });
        return;
      }

      // 创建评论
      const comment: IComment = new Comment({
        user: userId,
        activity: activityId,
        content,
        rating,
        images: images || []
      });

      await comment.save();
      await comment.populate('user', 'username avatar');

      res.status(201).json({
        success: true,
        message: '评论创建成功',
        data: { comment }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '评论创建失败'
      });
    }
  }

  // 获取活动评论列表
  static async getActivityComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { activityId } = req.params;
      const { page = 1, limit = 10, rating } = req.query;

      if (!mongoose.Types.ObjectId.isValid(activityId)) {
        res.status(400).json({
          success: false,
          message: '无效的活动ID'
        });
        return;
      }

      const query: any = { activity: activityId };
      if (rating) {
        query.rating = Number(rating);
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [comments, total] = await Promise.all([
        Comment.find(query)
          .populate('user', 'username avatar')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Comment.countDocuments(query)
      ]);

      // 计算平均评分
      const avgRatingResult = await Comment.aggregate([
        { $match: { activity: new mongoose.Types.ObjectId(activityId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalComments: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        }
      ]);

      const statistics = avgRatingResult[0] || {
        averageRating: 0,
        totalComments: 0,
        ratingDistribution: []
      };

      // 计算评分分布
      const ratingCounts = [0, 0, 0, 0, 0]; // 1-5星的数量
      statistics.ratingDistribution.forEach((rating: number) => {
        if (rating >= 1 && rating <= 5) {
          ratingCounts[rating - 1]++;
        }
      });

      res.json({
        success: true,
        data: {
          comments,
          statistics: {
            averageRating: Number(statistics.averageRating.toFixed(1)),
            totalComments: statistics.totalComments,
            ratingDistribution: ratingCounts.map((count, index) => ({
              rating: index + 1,
              count
            }))
          },
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
        message: error.message || '获取评论列表失败'
      });
    }
  }

  // 获取用户评论列表
  static async getUserComments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { page = 1, limit = 10 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const [comments, total] = await Promise.all([
        Comment.find({ user: userId })
          .populate('activity', 'title startTime endTime location images')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Comment.countDocuments({ user: userId })
      ]);

      res.json({
        success: true,
        data: {
          comments,
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
        message: error.message || '获取用户评论失败'
      });
    }
  }

  // 更新评论
  static async updateComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content, rating, images } = req.body;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: '无效的评论ID'
        });
        return;
      }

      const comment = await Comment.findById(id);

      if (!comment) {
        res.status(404).json({
          success: false,
          message: '评论不存在'
        });
        return;
      }

      // 检查权限
      if (comment.user.toString() !== userId) {
        res.status(403).json({
          success: false,
          message: '无权修改此评论'
        });
        return;
      }

      // 检查评论时间（创建后24小时内可修改）
      const hoursSinceCreation = (new Date().getTime() - comment.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCreation > 24) {
        res.status(400).json({
          success: false,
          message: '评论创建24小时后不可修改'
        });
        return;
      }

      // 更新评论
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        {
          ...(content && { content }),
          ...(rating && { rating }),
          ...(images && { images })
        },
        { new: true, runValidators: true }
      ).populate('user', 'username avatar');

      res.json({
        success: true,
        message: '评论更新成功',
        data: { comment: updatedComment }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || '评论更新失败'
      });
    }
  }

  // 删除评论
  static async deleteComment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: '无效的评论ID'
        });
        return;
      }

      const comment = await Comment.findById(id);

      if (!comment) {
        res.status(404).json({
          success: false,
          message: '评论不存在'
        });
        return;
      }

      // 检查权限
      if (comment.user.toString() !== userId && req.user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: '无权删除此评论'
        });
        return;
      }

      await Comment.findByIdAndDelete(id);

      res.json({
        success: true,
        message: '评论删除成功'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '评论删除失败'
      });
    }
  }
}
