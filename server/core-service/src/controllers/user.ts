import { Request, Response } from 'express';
import { db } from '../utils/db';

export async function loggedInUser(req: Request, res: Response) {
  try {
    const { id } = req.user;
    const loggedInUser = await db.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        group: {
          select: {
            id: true,
            channel: {
              select: {
                id: true
              },
              take: 1,
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        }
      }
    });

    if (loggedInUser) {
      if (loggedInUser.group.length > 0) {
        return res.status(207).json({
          id: loggedInUser.id,
          groupId: loggedInUser.group[0].id,
          channelId: loggedInUser.group[0].channel[0].id
        });
      }

      return res.status(200).json({
        message: 'User successfully logged in',
        id: loggedInUser.id
      });
    }

    return res.status(400).json({
      message: 'User could not be logged in! Try again'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
