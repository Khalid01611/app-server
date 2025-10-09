module.exports = {
  apps: [{
    name: 'eastwest-app',
    script: './build/server.js',
    cwd: '/path/to/your/app-server', // Update this to your actual server path on VPS
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    // Important for file uploads
    watch: false,
    ignore_watch: ['node_modules', 'uploads', 'logs'],
    // Log configuration
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Auto restart configuration
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '1G',
    // Environment variables for production
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000,
      UPLOAD_DIR: '/path/to/your/app-server/uploads' // Update this path
    }
  }]
};