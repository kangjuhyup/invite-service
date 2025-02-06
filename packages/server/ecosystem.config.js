module.exports = {
  apps: [
    {
      name: 'invite-service',
      script: './dist/src/main.js',
      pre_start: 'yarn run-migrations',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
