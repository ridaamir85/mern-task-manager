const app = require('./src/app');

const port = process.env.PORT || 5000;

async function startServer() {
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Could not start server:', error.message);
  process.exit(1);
});
