import { notification } from 'antd';

/**
 * 全局错误处理工具
 */
export default {
  /**
   * 处理API错误
   * @param {Error} error - 错误对象
   * @param {string} [fallbackMessage='操作失败'] - 默认错误消息
   * @param {Function} [callback] - 错误处理后的回调函数
   */
  handleApiError: (error, fallbackMessage = '操作失败', callback) => {
    console.error('API Error:', error);

    notification.error({
      message: '操作失败',
      description: error.message || fallbackMessage,
      duration: 4,
    });

    if (typeof callback === 'function') {
      callback(error);
    }
  },

  /**
   * 处理网络错误
   * @param {Error} error - 错误对象
   * @param {Function} [callback] - 错误处理后的回调函数
   */
  handleNetworkError: (error, callback) => {
    console.error('Network Error:', error);

    notification.error({
      message: '网络错误',
      description: '连接服务器失败，请检查网络连接',
      duration: 4,
    });

    if (typeof callback === 'function') {
      callback(error);
    }
  },

  /**
   * 处理授权错误
   * @param {Error} error - 错误对象
   * @param {Function} [callback] - 错误处理后的回调函数
   */
  handleAuthError: (error, callback) => {
    console.error('Auth Error:', error);

    notification.error({
      message: '授权失败',
      description: '您的登录已过期，请重新登录',
      duration: 4,
    });

    // 清除登录状态
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');

    // 延迟跳转，让用户有时间看到通知
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);

    if (typeof callback === 'function') {
      callback(error);
    }
  },

  /**
   * 处理权限错误
   * @param {Error} error - 错误对象
   * @param {Function} [callback] - 错误处理后的回调函数
   */
  handlePermissionError: (error, callback) => {
    console.error('Permission Error:', error);

    notification.error({
      message: '权限不足',
      description: '您没有权限执行此操作',
      duration: 4,
    });

    if (typeof callback === 'function') {
      callback(error);
    }
  },
};
