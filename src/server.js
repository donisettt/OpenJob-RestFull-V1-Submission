require('dotenv').config();
const createApp = require('./app');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT, 10) || 5000;

const app = createApp();

app.listen(PORT, HOST, () => {
  console.log(`OpenJob API is running at http://${HOST}:${PORT}`);
});
