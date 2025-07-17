import http from '../utils/http';

/**
 * 节点管理相关API函数
 */
const NodesAPI = {
  /**
   * 获取所有节点列表
   * @returns {Promise<any>} - 节点列表
   */
  getNodes: () => {
    return http.get('/nodes');
  },

  /**
   * 获取单个节点详情
   * @param {string} nodeId - 节点ID
   * @returns {Promise<any>} - 节点详情
   */
  getNodeById: (nodeId) => {
    return http.get(`/nodes/${nodeId}`);
  },

  /**
   * 创建新节点
   * @param {Object} nodeData - 节点数据
   * @returns {Promise<any>} - 创建结果
   */
  createNode: (nodeData) => {
    return http.post('/nodes', nodeData);
  },

  /**
   * 更新节点
   * @param {string} nodeId - 节点ID
   * @param {Object} nodeData - 节点数据
   * @returns {Promise<any>} - 更新结果
   */
  updateNode: (nodeId, nodeData) => {
    return http.put(`/nodes/${nodeId}`, nodeData);
  },

  /**
   * 删除节点
   * @param {string} nodeId - 节点ID
   * @returns {Promise<any>} - 删除结果
   */
  deleteNode: (nodeId) => {
    return http.delete(`/nodes/${nodeId}`);
  },

  /**
   * 测试节点连接
   * @param {string} nodeId - 节点ID
   * @returns {Promise<any>} - 测试结果
   */
  testNodeConnection: (nodeId) => {
    return http.get(`/nodes/${nodeId}/test`);
  },
};

export default NodesAPI;
