import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Fallback error handler to avoid leaking stack traces
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
