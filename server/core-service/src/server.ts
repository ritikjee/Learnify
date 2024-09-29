import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import userRouter from './routes/user';
import groupRouter from './routes/group';
import paymentRouter from './routes/payment';
import channelRouter from './routes/channel';
import courseRouter from './routes/courses';
import integrationsRouter from './routes/integration';

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

app.use('/api/user', userRouter);
app.use('/api/group', groupRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/channel', channelRouter);
app.use('/api/course', courseRouter);
app.use('/api/integration', integrationsRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'No resource found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
