import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, SettingOutlined, CalendarOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import './AppLayout.css';

const { Header, Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'my-activities',
        icon: <CalendarOutlined />,
        label: '我的活动',
        onClick: () => navigate('/my-activities'),
      },
      {
        key: 'my-orders',
        icon: <ShoppingOutlined />,
        label: '我的订单',
        onClick: () => navigate('/my-orders'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '设置',
        onClick: () => navigate('/settings'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/activities',
      label: <Link to="/activities">活动列表</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">关于我们</Link>,
    },
    ...(user?.role === 'admin' ? [{
      key: '/activities/create',
      label: <Link to="/activities/create">创建活动</Link>,
    }] : []),
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <Link to="/">
              <h2>🏃‍♂️ UniMove</h2>
            </Link>
          </div>
          
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="app-menu"
          />
          
          <div className="app-header-actions">
            {isAuthenticated ? (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Button type="text" className="user-button">
                  <Space>
                    <Avatar
                      size="small"
                      src={user?.avatar}
                      icon={!user?.avatar && <UserOutlined />}
                    />
                    <span className="username">{user?.username}</span>
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button type="text" onClick={() => navigate('/login')}>
                  登录
                </Button>
                <Button type="primary" onClick={() => navigate('/register')}>
                  注册
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Header>
      
      <Content className="app-content">
        <div className="app-content-wrapper">
          {children}
        </div>
      </Content>
      
      <Footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 UniMove 体育场所预约系统. All rights reserved.</p>
          <p>让运动更简单，让生活更精彩</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
