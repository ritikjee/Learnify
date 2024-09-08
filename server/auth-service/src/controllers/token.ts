import { Request, Response } from 'express';
import { decodeToken } from '../utils/generate-token';

export function accessToken(req: Request, res: Response) {
  const { refresh_token } = req.cookies;

  const token = decodeToken(refresh_token);

  if (!token) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  res.cookie('access_token', 'access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });

  return res.status(200).json({
    message: 'Access token generated successfully'
  });
}
