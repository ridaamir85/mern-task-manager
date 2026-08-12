const mongoose = require('mongoose');
const app = require('./src/app');

const port = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Copy .env.example to .env and add your connection string.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Could not start server:', error.message);
  process.exit(1);
});
