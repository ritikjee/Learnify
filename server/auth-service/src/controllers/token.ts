import { Request, Response } from 'express';
import { decodeToken, generateToken } from '../utils/generate-token';

export function accessToken(req: Request, res: Response) {
  const { refresh_token } = req.cookies;

  const user = decodeToken(refresh_token);

  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  const access_token = generateToken(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET as string,
    '15m'
  );

  // Set the access token cookie in the response
  res.cookie('access_token', access_token, {
    httpOnly: true, // Ensure it's not accessible via JavaScript
    secure: true, // Use secure in production
    sameSite: 'none', // Adjust according to your needs (can be 'Lax' or 'Strict' based on your scenario)
    maxAge: 1000 * 60 * 15, // 15 minutes
    path: '/'
  });

  return res.status(200).json({
    message: 'Access token generated successfully',
    access_token
  });
}
