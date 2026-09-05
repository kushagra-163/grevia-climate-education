import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  await connectDB();

  const PORT = parseInt(env.PORT, 10);
  app.listen(PORT, () => {
    console.log(`[Grevia API] Server listening on port ${PORT} (${env.NODE_ENV})`);
  });
};

startServer().catch((err) => {
  console.error('[Grevia API] Fatal startup error:', err);
  process.exit(1);
});
