import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import channelRouter from './routes/channel';
import courseRouter from './routes/courses';
import groupRouter from './routes/group';
import integrationsRouter from './routes/integration';
import paymentRouter from './routes/payment';
import userRouter from './routes/user';

const app: Express = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: '*',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from core service' });
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

app.listen(PORT, () => console.log('Running on port ' + PORT));
