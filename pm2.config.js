module.exports = {
  apps: [
    {
      name: 'blog-react', // 进程名称
      script: 'npm', // 启动脚本
      args: 'start', // 启动命令
      cwd: '/Users/liujiecheng/Documents/myProject/blog/client', // 项目目录
      autorestart: true, // 自动重启
      watch: true, // 监听文件变化
      ignore_watch: ['node_modules'], // 忽略监听的文件夹
      instances: 1, // 进程实例数量
      exec_mode: 'fork', // 执行模式
      env: {
        NODE_ENV: 'production', // 设置环境变量
      },
    },
  ],
};
