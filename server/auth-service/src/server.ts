import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { router as authRouter } from './routes/auth';
import { router as userRouter } from './routes/token';

const app: Express = express();

const PORT = Number(process.env.PORT || 5050);

app.use(
  cors({
    origin: '*',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from auth service' });
});

app.use('/api/auth', authRouter);
app.use('/api/token', userRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'No resource found' });
});

app.listen(PORT, () => console.log('Running on port ' + PORT));
