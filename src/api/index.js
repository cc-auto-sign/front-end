import AuthAPI from './auth';
import NodesAPI from './nodes';
import TasksAPI from './tasks';
import PluginsAPI from './plugins';
import LogsAPI from './logs';

// 导出所有API模块
export {
  AuthAPI,
  NodesAPI,
  TasksAPI,
  PluginsAPI,
  LogsAPI,
};

// 默认导出
export default {
  auth: AuthAPI,
  nodes: NodesAPI,
  tasks: TasksAPI,
  plugins: PluginsAPI,
  logs: LogsAPI,
};
