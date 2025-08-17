import api from './index';
import type { User } from './user';
import type { Activity } from './activity';

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  activity: Activity;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paymentTime?: string;
  cancelReason?: string;
  refundAmount?: number;
  refundTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  activityId: string;
}

export interface PayOrderData {
  paymentMethod: 'wechat' | 'alipay' | 'card';
}

export interface CancelOrderData {
  reason?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface OrderListResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      current: number;
      total: number;
      count: number;
    };
  };
}

export const orderAPI = {
  // 创建订单
  createOrder: async (data: CreateOrderData): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
    return api.post('/orders', data);
  },

  // 获取用户订单列表
  getUserOrders: async (filters?: OrderFilters): Promise<OrderListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/orders?${params.toString()}`);
  },

  // 获取订单详情
  getOrderById: async (id: string): Promise<{ success: boolean; data: { order: Order } }> => {
    return api.get(`/orders/${id}`);
  },

  // 支付订单
  payOrder: async (id: string, data: PayOrderData): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
    return api.put(`/orders/${id}/pay`, data);
  },

  // 取消订单
  cancelOrder: async (id: string, data?: CancelOrderData): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
    return api.put(`/orders/${id}/cancel`, data || {});
  },

  // 获取活动的订单列表（组织者使用）
  getActivityOrders: async (activityId: string, filters?: OrderFilters): Promise<OrderListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    return api.get(`/orders/activity/${activityId}?${params.toString()}`);
  },
};
