import http from '../utils/http';

/**
 * 任务管理相关API函数
 */
const TasksAPI = {
  /**
   * 获取所有任务列表
   * @param {Object} params - 查询参数
   * @returns {Promise<any>} - 任务列表
   */
  getTasks: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return http.get(`/tasks${queryParams ? `?${queryParams}` : ''}`);
  },

  /**
   * 获取单个任务详情
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 任务详情
   */
  getTaskById: (taskId) => {
    return http.get(`/tasks/${taskId}`);
  },

  /**
   * 创建新任务
   * @param {Object} taskData - 任务数据
   * @returns {Promise<any>} - 创建结果
   */
  createTask: (taskData) => {
    return http.post('/tasks', taskData);
  },

  /**
   * 更新任务
   * @param {string} taskId - 任务ID
   * @param {Object} taskData - 任务数据
   * @returns {Promise<any>} - 更新结果
   */
  updateTask: (taskId, taskData) => {
    return http.put(`/tasks/${taskId}`, taskData);
  },

  /**
   * 删除任务
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 删除结果
   */
  deleteTask: (taskId) => {
    return http.delete(`/tasks/${taskId}`);
  },

  /**
   * 执行任务
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 执行结果
   */
  executeTask: (taskId) => {
    return http.post(`/tasks/${taskId}/execute`);
  },

  /**
   * 暂停任务
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 暂停结果
   */
  pauseTask: (taskId) => {
    return http.post(`/tasks/${taskId}/pause`);
  },

  /**
   * 恢复任务
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 恢复结果
   */
  resumeTask: (taskId) => {
    return http.post(`/tasks/${taskId}/resume`);
  },

  /**
   * 获取任务执行历史
   * @param {string} taskId - 任务ID
   * @returns {Promise<any>} - 执行历史
   */
  getTaskHistory: (taskId) => {
    return http.get(`/tasks/${taskId}/history`);
  },
};

export default TasksAPI;
