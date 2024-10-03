import { Router } from 'express';
import fileRouter from './routes/file-upload';

export const router = Router();

router.route('/file-upload').all(fileRouter);
