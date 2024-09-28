import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../utils/db';
import { generateToken } from '../utils/generate-token';

export async function register(req: Request, res: Response) {
  const { firstname, lastname, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email.'
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const token = uuid();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        verificationToken: token,
        tokenExpiry: tokenExpiry
      }
    });

    return res.status(201).json({
      message: 'User registered successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while registering the user.'
    });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'User not found with this email.'
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid password.'
      });
    }
    const refresh_token = generateToken(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET as string,
      '30d'
    );

    const access_token = generateToken(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET as string,
      '15m'
    );

    // WIP: SET COOKIES USING EXPRESS

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 86400 * 30
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // WIP : Chnage it to 15 min
      maxAge: 1000 * 86400 * 30
    });

    return res.status(200).json({
      message: 'User logged in successfully.',
      refresh_token,
      access_token
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while logging in the user.'
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refresh_token');
  return res.status(200).json({
    message: 'User logged out successfully.'
  });
}

export async function verifyUser(req: Request, res: Response) {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }
    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: `${user.firstname} ${user.lastname}`
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
}
