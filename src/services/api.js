// 签到管理系统API服务

/**
 * 获取支持的平台列表
 * @returns {Promise<Array>} 平台列表
 */
export const getPlatforms = async () => {
  // 模拟API调用
  // 实际项目中应替换为真实的API请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '微博', icon: '微博', description: '新浪微博自动签到', installed: true, status: 'active' },
        { id: 2, name: '知乎', icon: '知乎', description: '知乎每日签到', installed: true, status: 'active' },
      ]);
    }, 1000);
  });
};

/**
 * 获取签到日志
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} 签到日志列表
 */
export const getSignInLogs = async (params = {}) => {
  // 模拟API调用
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, platform: '微博', status: 'success', time: '2025-07-15 08:00:00', message: '签到成功，获得5积分' },
        { id: 2, platform: '知乎', status: 'success', time: '2025-07-15 08:01:23', message: '签到成功，获得10经验值' },
        { id: 3, platform: '微博', status: 'success', time: '2025-07-14 08:00:12', message: '签到成功，获得5积分' },
        { id: 4, platform: '知乎', status: 'failed', time: '2025-07-14 08:02:01', message: '签到失败，网络超时' },
        { id: 5, platform: '微博', status: 'success', time: '2025-07-13 09:12:43', message: '签到成功，获得10积分' },
      ]);
    }, 1000);
  });
};

/**
 * 获取统计数据
 * @returns {Promise<Object>} 统计数据
 */
export const getStatistics = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalPlatforms: 2,
        totalSignIns: 124,
        successRate: 98.4,
        todaySignIns: 2
      });
    }, 800);
  });
};

/**
 * 安装平台插件
 * @param {number} platformId 平台ID
 * @returns {Promise<Object>} 安装结果
 */
export const installPlatform = async (platformId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: '安装成功' });
    }, 1500);
  });
};

/**
 * 获取节点列表
 * @returns {Promise<Array>} 节点列表
 */
export const getNodes = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: '主节点-阿里云',
          ip: '121.40.168.21',
          status: 'online',
          type: 'master',
          region: '华东',
          lastActive: '2025-07-15 10:30:15',
          performance: 'good',
          cpu: 32,
          memory: 70,
          tasks: 156,
          platform: 'linux'
        },
        {
          id: 2,
          name: '备用节点-腾讯云',
          ip: '118.25.63.45',
          status: 'online',
          type: 'worker',
          region: '华南',
          lastActive: '2025-07-15 10:28:22',
          performance: 'medium',
          cpu: 56,
          memory: 45,
          tasks: 89,
          platform: 'linux'
        },
        {
          id: 3,
          name: '边缘节点-北京',
          ip: '116.62.186.85',
          status: 'offline',
          type: 'worker',
          region: '华北',
          lastActive: '2025-07-14 18:45:36',
          performance: 'poor',
          cpu: 0,
          memory: 0,
          tasks: 0,
          platform: 'windows'
        },
        {
          id: 4,
          name: '美国节点',
          ip: '47.89.185.35',
          status: 'online',
          type: 'worker',
          region: '北美',
          lastActive: '2025-07-15 10:25:18',
          performance: 'good',
          cpu: 28,
          memory: 30,
          tasks: 42,
          platform: 'linux'
        },
        {
          id: 5,
          name: '香港节点',
          ip: '47.244.33.65',
          status: 'maintenance',
          type: 'worker',
          region: '香港',
          lastActive: '2025-07-15 09:05:44',
          performance: 'medium',
          cpu: 45,
          memory: 60,
          tasks: 0,
          platform: 'linux'
        }
      ]);
    }, 1000);
  });
};

/**
 * 添加节点
 * @param {Object} nodeData 节点数据
 * @returns {Promise<Object>} 添加结果
 */
export const addNode = async (nodeData) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: '节点添加成功', 
        nodeId: Date.now()
      });
    }, 1000);
  });
};

/**
 * 更新节点
 * @param {number} nodeId 节点ID
 * @param {Object} nodeData 节点数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateNode = async (nodeId, nodeData) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: '节点更新成功'
      });
    }, 1000);
  });
};

/**
 * 删除节点
 * @param {number} nodeId 节点ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteNode = async (nodeId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: '节点删除成功'
      });
    }, 1000);
  });
};
