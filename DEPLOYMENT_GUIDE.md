# PM2 Deployment Guide for Ubuntu VPS

## Common Issues and Solutions

### 1. "Not connected" Error - Socket.IO Issues

**Problem**: Socket.IO connections fail when using PM2
**Solution**: Update your ecosystem.config.js with correct paths

```bash
# On your VPS, update ecosystem.config.js
module.exports = {
  apps: [{
    name: 'eastwest-app',
    script: './build/server.js',
    cwd: '/home/your-username/your-app-path/app-server', // Update this path
    instances: 1,
    exec_mode: 'fork',
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000,
      UPLOAD_DIR: '/home/your-username/your-app-path/app-server/uploads' // Update this path
    }
  }]
};
```

### 2. File Upload Issues

**Problem**: Images/voice recordings fail to upload
**Solutions**:

1. **Check directory permissions**:
```bash
chmod -R 755 uploads/
chown -R your-username:your-username uploads/
```

2. **Ensure directories exist**:
```bash
mkdir -p uploads/chat uploads/site uploads/avatars
```

3. **Check disk space**:
```bash
df -h
```

### 3. Deployment Steps

1. **Build the application**:
```bash
npm run build
```

2. **Run debug script**:
```bash
node pm2-debug.js
```

3. **Deploy with PM2**:
```bash
chmod +x deploy.sh
./deploy.sh
```

4. **Check PM2 status**:
```bash
pm2 status
pm2 logs eastwest-app --lines 50
```

### 4. Environment Variables

Update your `.env` file on the VPS:
```bash
# Uncomment and update this line with your actual path
UPLOAD_DIR=/home/your-username/your-app-path/app-server/uploads
```

### 5. Nginx Configuration (if using reverse proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static file serving for uploads
    location /uploads/ {
        alias /home/your-username/your-app-path/app-server/uploads/;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. Troubleshooting Commands

```bash
# Check PM2 processes
pm2 list

# View logs
pm2 logs eastwest-app --lines 100

# Restart application
pm2 restart eastwest-app

# Monitor in real-time
pm2 monit

# Check system resources
htop
df -h
free -h

# Test Socket.IO connection
curl -X GET http://localhost:8000/health

# Check file permissions
ls -la uploads/
```

### 7. Common Error Messages

- **"ENOENT: no such file or directory"**: Directory doesn't exist
- **"EACCES: permission denied"**: Wrong file permissions
- **"Not connected"**: Socket.IO connection issues
- **"CORS error"**: Check ALLOWED_ORIGINS in .env

### 8. PM2 Startup Script

To auto-start PM2 on server reboot:
```bash
pm2 startup
pm2 save
```