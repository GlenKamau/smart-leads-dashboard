import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import leadRoutes from './modules/leads/lead.routes';
import { errorResponse } from './utils/response.util';

const app: Application = express();

app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'https://smart-leads-dashboard-amber.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Leads Dashboard API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return errorResponse(res, 'Internal server error', 500);
});

export default app;