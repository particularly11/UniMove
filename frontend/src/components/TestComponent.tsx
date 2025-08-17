import React from 'react';
import { Button } from 'antd';

const TestComponent: React.FC = () => {
  return (
    <div>
      <h1>测试中文显示</h1>
      <p>这是一个测试中文编码的组件</p>
      <Button type="primary">中文按钮</Button>
    </div>
  );
};

export default TestComponent;
