import api from './index';
import type { User } from './user';
import type { Activity } from './activity';

export interface Comment {
  _id: string;
  user: User;
  activity: Activity;
  content: string;
  rating: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  activityId: string;
  content: string;
  rating: number;
  images?: string[];
}

export interface UpdateCommentData {
  content?: string;
  rating?: number;
  images?: string[];
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  rating?: number;
}

export interface CommentStatistics {
  averageRating: number;
  totalComments: number;
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
}

export interface CommentListResponse {
  success: boolean;
  data: {
    comments: Comment[];
    statistics?: CommentStatistics;
    pagination: {
      current: number;
      total: number;
      count: number;
    };
  };
}

export const commentAPI = {
  // 创建评论
  createComment: async (data: CreateCommentData): Promise<{ success: boolean; message: string; data: { comment: Comment } }> => {
    return api.post('/comments', data);
  },

  // 获取活动评论列表
  getActivityComments: async (activityId: string, filters?: CommentFilters): Promise<CommentListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/comments/activity/${activityId}?${params.toString()}`);
  },

  // 获取用户评论列表
  getUserComments: async (filters?: Pick<CommentFilters, 'page' | 'limit'>): Promise<CommentListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/comments/my?${params.toString()}`);
  },

  // 更新评论
  updateComment: async (id: string, data: UpdateCommentData): Promise<{ success: boolean; message: string; data: { comment: Comment } }> => {
    return api.put(`/comments/${id}`, data);
  },

  // 删除评论
  deleteComment: async (id: string): Promise<{ success: boolean; message: string }> => {
    return api.delete(`/comments/${id}`);
  },
};
