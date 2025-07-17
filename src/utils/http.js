import { baseUrl, storeUrl } from '../config/config';

/**
 * HTTP请求工具类
 * 封装了基础的网络请求功能，自动处理token和错误
 */
class Http {
  /**
   * 发送请求的核心方法
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @param {boolean} isAuthRequired - 是否需要身份验证
   * @param {boolean} useStoreUrl - 是否使用商店URL
   * @returns {Promise<any>} - 响应数据
   */
  async request(url, options = {}, isAuthRequired = true, useStoreUrl = false) {
    const baseURL = useStoreUrl ? storeUrl : baseUrl;
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

    // 设置默认headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 如果需要身份验证，添加Authorization头
    if (isAuthRequired) {
      const token = localStorage.getItem('token');
      if (!token) {
        // 如果需要token但没有找到，重定向到登录页
        window.location.href = '/login';
        return Promise.reject(new Error('未授权，请先登录'));
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 合并选项
    const requestOptions = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(fullUrl, requestOptions);

      // 解析响应JSON
      const data = await response.json();

      // 即使HTTP状态是200，也需要检查业务状态码
      if (!response.ok || (data && data.code !== 200)) {
        // 处理401未授权错误 (HTTP状态或业务状态码)
        if (response.status === 401 || (data && data.code === 401)) {
          // 清除本地存储的token
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userName');

          // 重定向到登录页
          window.location.href = '/login';
          throw new Error(data?.message || '未授权，请重新登录');
        }

        // 处理403权限不足
        if (response.status === 403 || (data && data.code === 403)) {
          throw new Error(data?.message || '权限不足，无法访问');
        }

        // 处理404资源不存在
        if (response.status === 404 || (data && data.code === 404)) {
          throw new Error(data?.message || '请求的资源不存在');
        }

        // 处理400参数错误
        if (response.status === 400 || (data && data.code === 400)) {
          throw new Error(data?.message || '请求参数错误');
        }

        // 处理500服务器错误
        if (response.status === 500 || (data && data.code === 500)) {
          throw new Error(data?.message || '服务器内部错误');
        }

        // 处理其他错误
        throw new Error(data?.message || `请求失败(${data?.code || response.status})`);
      }

      // 返回数据部分
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  /**
   * 发送GET请求
   * @param {string} url - 请求URL
   * @param {boolean} isAuthRequired - 是否需要身份验证
   * @param {boolean} useStoreUrl - 是否使用商店URL
   * @returns {Promise<any>} - 响应数据
   */
  get(url, isAuthRequired = true, useStoreUrl = false) {
    return this.request(url, { method: 'GET' }, isAuthRequired, useStoreUrl);
  }

  /**
   * 发送POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {boolean} isAuthRequired - 是否需要身份验证
   * @param {boolean} useStoreUrl - 是否使用商店URL
   * @returns {Promise<any>} - 响应数据
   */
  post(url, data, isAuthRequired = true, useStoreUrl = false) {
    return this.request(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      isAuthRequired,
      useStoreUrl
    );
  }

  /**
   * 发送PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {boolean} isAuthRequired - 是否需要身份验证
   * @param {boolean} useStoreUrl - 是否使用商店URL
   * @returns {Promise<any>} - 响应数据
   */
  put(url, data, isAuthRequired = true, useStoreUrl = false) {
    return this.request(
      url,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      isAuthRequired,
      useStoreUrl
    );
  }

  /**
   * 发送DELETE请求
   * @param {string} url - 请求URL
   * @param {boolean} isAuthRequired - 是否需要身份验证
   * @param {boolean} useStoreUrl - 是否使用商店URL
   * @returns {Promise<any>} - 响应数据
   */
  delete(url, isAuthRequired = true, useStoreUrl = false) {
    return this.request(url, { method: 'DELETE' }, isAuthRequired, useStoreUrl);
  }

  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<any>} - 响应数据
   */
  async login(username, password) {
    try {
      const response = await this.post(
        '/login',
        { username, password },
        false // 登录不需要Authorization
      );

      // 登录成功，保存token和登录状态
      if (response.code === 200 && response.data?.AccessToken) {
        localStorage.setItem('token', response.data.AccessToken);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', username);
        return response;
      }

      throw new Error(response.message || '登录失败');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * 用户登出
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  }
}

// 导出HTTP工具类实例
const http = new Http();
export default http;
