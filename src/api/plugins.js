import http from '../utils/http';

/**
 * 插件相关API函数
 */
const PluginsAPI = {
  /**
   * 获取插件商店列表
   * @param {Object} params - 查询参数
   * @returns {Promise<any>} - 插件列表
   */
  getStorePlugins: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return http.get(
      `/plugins/store${queryParams ? `?${queryParams}` : ''}`,
      true,
      true // 使用storeUrl
    );
  },

  /**
   * 获取已安装插件列表
   * @returns {Promise<any>} - 已安装插件列表
   */
  getInstalledPlugins: () => {
    return http.get('/plugins');
  },

  /**
   * 获取插件详情
   * @param {string} pluginId - 插件ID
   * @returns {Promise<any>} - 插件详情
   */
  getPluginById: (pluginId) => {
    return http.get(`/plugins/${pluginId}`);
  },

  /**
   * 安装插件
   * @param {string} pluginId - 插件ID
   * @returns {Promise<any>} - 安装结果
   */
  installPlugin: (pluginId) => {
    return http.post(`/plugins/install`, { pluginId });
  },

  /**
   * 卸载插件
   * @param {string} pluginId - 插件ID
   * @returns {Promise<any>} - 卸载结果
   */
  uninstallPlugin: (pluginId) => {
    return http.post(`/plugins/${pluginId}/uninstall`);
  },

  /**
   * 更新插件
   * @param {string} pluginId - 插件ID
   * @returns {Promise<any>} - 更新结果
   */
  updatePlugin: (pluginId) => {
    return http.post(`/plugins/${pluginId}/update`);
  },

  /**
   * 上传自定义插件
   * @param {FormData} formData - 包含插件文件的表单数据
   * @returns {Promise<any>} - 上传结果
   */
  uploadPlugin: (formData) => {
    return http.request(
      '/plugins/upload',
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

export default PluginsAPI;
