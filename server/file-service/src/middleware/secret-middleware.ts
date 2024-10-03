import { Request, Response, NextFunction } from 'express';

export default function secretMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const secret = req.headers['x-secret'];

  if (secret !== process.env.X_APP_SECRET) {
    return res.status(401).json({ message: 'Unauthorised' });
  }

  next();
}
