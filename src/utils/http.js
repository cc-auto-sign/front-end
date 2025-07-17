import { baseUrl, storeUrl } from '../config/config';
import errorHandler from './errorHandler';

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
      const response = await fetch(fullUrl, requestOptions)
        .catch(networkError => {
          // 处理网络错误
          errorHandler.handleNetworkError(networkError);
          throw networkError;
        });

      // 解析响应JSON
      const data = await response.json();

      // 即使HTTP状态是200，也需要检查业务状态码
      if (!response.ok || (data && data.code !== 200)) {
        const errorMessage = data?.message || `请求失败(${data?.code || response.status})`;

        // 处理401未授权错误 (HTTP状态或业务状态码)
        if (response.status === 401 || (data && data.code === 401)) {
          const authError = new Error(errorMessage || '未授权，请重新登录');
          authError.status = 401;
          authError.code = data?.code || 401;
          throw authError;
        }

        // 处理403权限不足
        if (response.status === 403 || (data && data.code === 403)) {
          const permissionError = new Error(errorMessage || '权限不足，无法访问');
          permissionError.status = 403;
          permissionError.code = data?.code || 403;
          throw permissionError;
        }

        // 处理404资源不存在
        if (response.status === 404 || (data && data.code === 404)) {
          const notFoundError = new Error(errorMessage || '请求的资源不存在');
          notFoundError.status = 404;
          notFoundError.code = data?.code || 404;
          throw notFoundError;
        }

        // 处理400参数错误
        if (response.status === 400 || (data && data.code === 400)) {
          const badRequestError = new Error(errorMessage || '请求参数错误');
          badRequestError.status = 400;
          badRequestError.code = data?.code || 400;
          throw badRequestError;
        }

        // 处理500服务器错误
        if (response.status === 500 || (data && data.code === 500)) {
          const serverError = new Error(errorMessage || '服务器内部错误');
          serverError.status = 500;
          serverError.code = data?.code || 500;
          throw serverError;
        }

        // 处理其他错误
        const genericError = new Error(errorMessage);
        genericError.status = response.status;
        genericError.code = data?.code || response.status;
        throw genericError;
      }

      // 返回数据部分
      return data;
    } catch (error) {
      console.error('Request failed:', error);

      // 根据错误类型处理
      if (error.status === 401 || error.code === 401) {
        errorHandler.handleAuthError(error);
      } else if (error.status === 403 || error.code === 403) {
        errorHandler.handlePermissionError(error);
      } else if (!navigator.onLine) {
        errorHandler.handleNetworkError(error);
      } else {
        // 默认API错误处理
        errorHandler.handleApiError(error);
      }

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

        // 登录成功后获取用户信息
        try {
          await this.getUserInfo();
        } catch (userInfoError) {
          console.warn('获取用户信息失败，但不影响登录:', userInfoError);
        }

        return response;
      }

      throw new Error(response.message || '登录失败');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * 获取用户信息并存储
   * @returns {Promise<any>} - 用户信息
   */
  async getUserInfo() {
    try {
      const response = await this.get('/userInfo');

      if (response.code === 200 && response.data) {
        // 可以在这里存储一些基本用户信息到localStorage
        if (response.data.nickName) {
          localStorage.setItem('userName', response.data.nickName);
        }
      }

      return response;
    } catch (error) {
      console.error('Get user info failed:', error);
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
