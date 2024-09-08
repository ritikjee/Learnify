import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import { router as authRouter } from './routes/auth';
import { router as userRouter } from './routes/token';

const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from auth service' });
});

app.use('/api/auth', authRouter);
app.use('/token/user', userRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'No resource found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
