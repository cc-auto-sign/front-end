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
    return http.get('/userInfo');
  },

  /**
   * 获取用户的菜单、权限信息
   * @returns {Promise<any>} - 用户的菜单和权限信息
   */
  getUserPermissions: () => {
    return http.get('/userInfo');
  },

  /**
   * 更新用户个人信息
   * @param {Object} userInfo - 用户信息对象
   * @returns {Promise<any>} - 更新结果
   */
  updateUserInfo: (userInfo) => {
    return http.put('/user/profile', userInfo);
  },

  /**
   * 更新用户密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<any>} - 更新结果
   */
  updatePassword: (oldPassword, newPassword) => {
    return http.put('/user/password', { oldPassword, newPassword });
  },

  /**
   * 更新用户头像
   * @param {FormData} formData - 包含头像文件的表单数据
   * @returns {Promise<any>} - 更新结果
   */
  updateAvatar: (formData) => {
    return http.request(
      '/user/avatar',
      {
        method: 'POST',
        body: formData,
        // 不设置 Content-Type，让浏览器自动设置包含 boundary 的正确值
        headers: {},
      },
      true
    );
  },
};

export default AuthAPI;
