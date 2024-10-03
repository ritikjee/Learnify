import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import authMiddleware from './middleware/auth-middleware';
import secretMiddleware from './middleware/secret-middleware';
import { router } from '.';

const app: Express = express();

const PORT = Number(process.env.PORT) || 6000;

app.use(
  cors({
    origin: '*',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello from file service'
  });
});

app.use('/api', authMiddleware, secretMiddleware, router);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => console.log('Running on port ' + PORT));
