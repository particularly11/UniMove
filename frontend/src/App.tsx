import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivityList from './pages/ActivityList';
import ActivityDetail from './pages/ActivityDetail';
import CreateActivity from './pages/CreateActivity';
import Profile from './pages/Profile';
import About from './pages/About';
import NotFound from './pages/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Routes>
            {/* 认证页面不使用布局 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 使用布局的页面 */}
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/activities" element={<ActivityList />} />
                  <Route path="/activities/create" element={<CreateActivity />} />
                  <Route path="/activities/:id" element={<ActivityDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
