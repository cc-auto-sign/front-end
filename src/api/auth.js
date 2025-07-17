import http from '../utils/http';

/**
 * 认证相关API函数
 */
const AuthAPI = {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<any>} - 登录响应
   */
  login: (username, password) => {
    return http.login(username, password);
  },

  /**
   * 用户登出
   */
  logout: () => {
    http.logout();
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<any>} - 用户信息
   */
  getUserInfo: () => {
    return http.get('/user/info');
  },
};

export default AuthAPI;
