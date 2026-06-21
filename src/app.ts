import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Routes
app.use('/api/users', userRoutes);

export default app;
