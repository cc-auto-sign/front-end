module.exports = {
  ci: {
    collect: {
      // 要测试的 URL
      url: ['http://localhost:3000'],
      // 运行次数
      numberOfRuns: 3,
      // 设置
      settings: {
        // 模拟移动设备
        preset: 'desktop',
        // 禁用存储重置（加快测试速度）
        disableStorageReset: true,
        // 跳过审计
        skipAudits: [
          'uses-http2',
          'uses-long-cache-ttl',
          'uses-text-compression'
        ]
      }
    },
    assert: {
      // 性能阈值设置
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        // 具体指标阈值
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }]
      }
    },
    upload: {
      // 如果使用 Lighthouse CI 服务器，配置上传
      target: 'temporary-public-storage'
    }
  }
};
