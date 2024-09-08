import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../utils/generate-token';
import { db } from '../utils/db';

export async function protect(req: Request, res: Response, next: NextFunction) {
  const { access_token } = req.cookies;

  try {
    if (!access_token) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const token = decodeToken(access_token);

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: token.id,
        verified: true
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        password: false
      }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while verifying the user.'
    });
  }
}
