import { Request, Response } from 'express';
import { db } from '../utils/db';
import bcryptjs from 'bcryptjs';
import { decodeToken, generateToken } from '../utils/generate-token';
import { v4 as uuid } from 'uuid';

export async function register(req: Request, res: Response) {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const existingUser = await db.authUser.findUnique({
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

    const user = await db.authUser.create({
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
      message: 'User registered successfully.',
      user
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
    const user = await db.authUser.findUnique({
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
    const token = generateToken({
      id: user.id,
      email: user.email
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    return res.status(200).json({
      message: 'User logged in successfully.',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong while logging in the user.'
    });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  return res.status(200).json({
    message: 'User logged out successfully.'
  });
}

export async function verifyToken(req: Request, res: Response) {
  const token = req.query.token;

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  const decoded = decodeToken(token.toString());

  if (!decoded) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  const user = await db.authUser.findUnique({
    where: {
      id: decoded.id,
      verified: true
    }
  });

  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email
  });
}
