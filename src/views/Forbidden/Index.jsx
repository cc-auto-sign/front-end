import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

/**
 * 403权限不足页面
 */
const Forbidden = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问此页面。"
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  );
};

export default Forbidden;
