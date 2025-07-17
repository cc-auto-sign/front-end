import React from 'react';
import { Spin } from 'antd';

/**
 * 页面加载组件
 * 用于显示全屏加载状态
 * 
 * @param {Object} props - 组件属性
 * @param {string} [props.message='加载中...'] - 加载提示文本
 * @returns {React.ReactNode} - 加载状态组件
 */
const PageLoading = ({ message = '加载中...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.65)'
    }}>
      <Spin size="large" />
      <div style={{ marginTop: 16, color: '#1677ff' }}>
        {message}
      </div>
    </div>
  );
};

export default PageLoading;
