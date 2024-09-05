import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from auth service' });
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'No resource found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
