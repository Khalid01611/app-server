// Debug script to check PM2 environment and paths
console.log('=== PM2 Debug Information ===');
console.log('Process ID:', process.pid);
console.log('Current Working Directory:', process.cwd());
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Upload Directory:', process.env.UPLOAD_DIR);
console.log('Port:', process.env.PORT);

const path = require('path');
const fs = require('fs');

const uploadRoot = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
console.log('Resolved Upload Root:', uploadRoot);
console.log('Upload Root Exists:', fs.existsSync(uploadRoot));

// Check subdirectories
const chatDir = path.join(uploadRoot, 'chat');
const siteDir = path.join(uploadRoot, 'site');
const avatarsDir = path.join(uploadRoot, 'avatars');

console.log('Chat Directory:', chatDir, 'Exists:', fs.existsSync(chatDir));
console.log('Site Directory:', siteDir, 'Exists:', fs.existsSync(siteDir));
console.log('Avatars Directory:', avatarsDir, 'Exists:', fs.existsSync(avatarsDir));

// Check permissions
try {
  fs.accessSync(uploadRoot, fs.constants.W_OK);
  console.log('Upload directory is writable');
} catch (err) {
  console.log('Upload directory is NOT writable:', err.message);
}

console.log('=== End Debug Information ===');