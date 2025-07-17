import http from '../utils/http';

/**
 * 日志相关API函数
 */
const LogsAPI = {
  /**
   * 获取系统日志列表
   * @param {Object} params - 查询参数 (page, size, startTime, endTime, level等)
   * @returns {Promise<any>} - 日志列表
   */
  getSystemLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return http.get(`/logs/system${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * 获取任务执行日志
   * @param {Object} params - 查询参数 (taskId, page, size, startTime, endTime等)
   * @returns {Promise<any>} - 任务日志列表
   */
  getTaskLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return http.get(`/logs/task${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * 获取节点日志
   * @param {Object} params - 查询参数 (nodeId, page, size, startTime, endTime等)
   * @returns {Promise<any>} - 节点日志列表
   */
  getNodeLogs: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return http.get(`/logs/node${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * 清除特定类型的日志
   * @param {string} logType - 日志类型 (system, task, node)
   * @param {Object} params - 清除参数 (beforeTime, level等)
   * @returns {Promise<any>} - 清除结果
   */
  clearLogs: (logType, params = {}) => {
    return http.delete(`/logs/${logType}`, true);
  },

  /**
   * 导出日志
   * @param {string} logType - 日志类型 (system, task, node)
   * @param {Object} params - 导出参数 (startTime, endTime, level等)
   * @returns {Promise<Blob>} - 导出的日志文件Blob
   */
  exportLogs: async (logType, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/logs/${logType}/export${queryParams ? `?${queryParams}` : ''}`;

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    const response = await fetch(`${http.baseUrl}${url}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('导出日志失败');
    }

    return response.blob();
  },
};

export default LogsAPI;
