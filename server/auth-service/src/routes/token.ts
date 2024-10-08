import { Router } from 'express';
import { accessToken } from '../controllers/token';

export const router = Router();

router.get('/refresh-token', accessToken);
