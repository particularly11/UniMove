import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Input, Select, Button, Space, Pagination, message, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { activityAPI } from '../api/activity';
import { orderAPI } from '../api/order';
import type { Activity, ActivityFilters } from '../api/activity';
import ActivityCard from '../components/ActivityCard';
import { useAppSelector } from '../store/hooks';
import './ActivityList.css';

const { Search } = Input;
const { Option } = Select;

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<string[]>([]); // 用户已参加的活动ID列表
  
  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 12,
  });

  // 筛选条件
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // 从URL参数初始化筛选条件
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters: ActivityFilters = {
      page: Number(searchParams.get('page')) || 1,
      limit: 12,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };
    
    setFilters(initialFilters);
    setPagination(prev => ({ ...prev, current: initialFilters.page || 1 }));
  }, [location.search]);

  // 获取活动列表
  const fetchActivities = useCallback(async (filterParams: ActivityFilters) => {
    setLoading(true);
    try {
      const response = await activityAPI.getActivities(filterParams);
      setActivities(response.data.activities);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.count,
        current: response.data.pagination.current,
      }));
      
      // 如果用户已登录，获取用户已报名的活动
      if (isAuthenticated) {
        try {
          const ordersResponse = await orderAPI.getUserOrders();
          if (ordersResponse.success) {
            // 提取已支付订单对应的活动ID
            const joinedActivityIds = ordersResponse.data.orders
              .filter(order => order.status === 'paid')
              .map(order => order.activity._id);
            setUserOrders(joinedActivityIds);
          }
        } catch (error) {
          console.error('获取用户订单失败:', error);
        }
      } else {
        setUserOrders([]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '获取活动列表失败';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchActivities(filters);
  }, [filters, fetchActivities]);



  // 更新URL参数
  const updateUrlParams = (newFilters: ActivityFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, String(value));
      }
    });
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // 处理筛选条件变化
  const handleFiltersChange = (newFilters: Partial<ActivityFilters>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: newFilters.page || 1, // 筛选条件变化时重置页码
    };
    
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    handleFiltersChange({ search: value, page: 1 });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    handleFiltersChange({ page });
  };

  // 处理参加活动
  const handleJoinActivity = async (activityId: string) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    setJoining(activityId);
    try {
      const response = await orderAPI.createOrder({ activityId });
      if (response.success) {
        message.success('报名成功！');
        // 更新用户已报名活动列表
        setUserOrders(prev => [...prev, activityId]);
        // 刷新活动列表以更新参与人数
        fetchActivities(filters);
      } else {
        message.error(response.message || '报名失败');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '报名失败';
      message.error(errorMessage);
    } finally {
      setJoining(null);
    }
  };

  // 处理退出活动
  const handleLeaveActivity = async (activityId: string) => {
    setJoining(activityId);
    try {
      // 首先获取用户的订单
      const ordersResponse = await orderAPI.getUserOrders();
      if (!ordersResponse.success) {
        message.error('获取订单信息失败');
        return;
      }

      // 找到对应活动的订单
      const order = ordersResponse.data.orders.find(order => 
        order.activity._id === activityId && order.status === 'paid'
      );

      if (!order) {
        message.error('未找到对应的订单');
        return;
      }

      // 取消订单
      const response = await orderAPI.cancelOrder(order._id, { reason: '用户主动取消' });
      if (response.success) {
        message.success('取消报名成功！');
        // 从用户已报名活动列表中移除
        setUserOrders(prev => prev.filter(id => id !== activityId));
        // 刷新活动列表以更新参与人数
        fetchActivities(filters);
      } else {
        message.error(response.message || '取消报名失败');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '取消报名失败';
      message.error(errorMessage);
    } finally {
      setJoining(null);
    }
  };

  // 重置筛选条件
  const handleReset = () => {
    const resetFilters: ActivityFilters = {
      page: 1,
      limit: 12,
      search: '',
      category: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    updateUrlParams(resetFilters);
  };

  return (
    <div className="activity-list-page">
      {/* 搜索和筛选 */}
      <Card className="filters-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="search-section">
            <Search
              placeholder="搜索活动标题、描述或标签..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
              allowClear
            />
          </div>
          
          <Row gutter={16} className="filter-section">
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="运动分类"
                value={filters.category || undefined}
                onChange={(value) => handleFiltersChange({ category: value, page: 1 })}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="篮球">篮球</Option>
                <Option value="足球">足球</Option>
                <Option value="羽毛球">羽毛球</Option>
                <Option value="乒乓球">乒乓球</Option>
                <Option value="网球">网球</Option>
                <Option value="游泳">游泳</Option>
                <Option value="健身">健身</Option>
                <Option value="跑步">跑步</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="活动地点"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                onPressEnter={() => handleFiltersChange({ location: filters.location, page: 1 })}
                allowClear
              />
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="排序方式"
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFiltersChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 });
                }}
                style={{ width: '100%' }}
              >
                <Option value="createdAt-desc">最新发布</Option>
                <Option value="startTime-asc">即将开始</Option>
                <Option value="price-asc">价格从低到高</Option>
                <Option value="price-desc">价格从高到低</Option>
                <Option value="currentParticipants-desc">参与人数最多</Option>
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => handleFiltersChange(filters)}
                >
                  筛选
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* 活动列表 */}
      <Spin spinning={loading}>
        <div className="activities-section">
          <Row gutter={[16, 16]}>
            {activities.map((activity) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={activity._id}>
                <ActivityCard
                  activity={activity}
                  onJoin={handleJoinActivity}
                  onLeave={handleLeaveActivity}
                  isJoined={userOrders.includes(activity._id)}
                  loading={joining === activity._id}
                />
              </Col>
            ))}
          </Row>
          
          {activities.length === 0 && !loading && (
            <Card className="empty-state">
              <div className="empty-content">
                <SearchOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <h3>没有找到符合条件的活动</h3>
                <p>试试调整筛选条件或关键词</p>
                <Button onClick={handleReset}>重置筛选条件</Button>
              </div>
            </Card>
          )}
        </div>
      </Spin>

      {/* 分页 */}
      {pagination.total > 0 && (
        <div className="pagination-section">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条活动`
            }
          />
        </div>
      )}
    </div>
  );
};

export default ActivityList;
