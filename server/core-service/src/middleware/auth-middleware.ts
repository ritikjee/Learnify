import { NextFunction, Request, Response } from 'express';
import config from '../config';
import axios from 'axios';

export default async function protect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { AUTH_SERVICE } = config.BACKEND_URL;

  try {
    const cookies = req.cookies;

    const { data } = await axios.get(`${AUTH_SERVICE}/api/auth/me`, {
      headers: {
        Cookie: Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')
      }
    });

    if (!data) {
      return res.status(401).json({
        message: 'Unauthorised'
      });
    }

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorised'
    });
  }
}
