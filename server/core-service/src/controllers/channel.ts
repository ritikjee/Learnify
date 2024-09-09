import { Request, Response } from 'express';
import { db } from '../utils/db';

export const onGetChannelInfo = async (req: Request, res: Response) => {
  const { channelid } = req.params;

  if (!channelid) {
    return res.status(400).json({ message: 'Channel ID is required' });
  }
  try {
    const user = req.user;
    const channel = await db.channel.findUnique({
      where: {
        id: channelid
      },
      include: {
        posts: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            channel: {
              select: {
                name: true
              }
            },
            author: {
              select: {
                firstname: true,
                lastname: true,
                image: true
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true
              }
            },
            likes: {
              where: {
                userId: user.id!
              },
              select: {
                userId: true,
                id: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json({ channel });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const onCreateNewChannel = async (req: Request, res: Response) => {
  const { groupid, data } = req.body;

  if (!groupid) {
    return res.status(400).json({ message: 'Group ID is required' });
  }
  if (!data) {
    return res.status(400).json({ message: 'Channel data is required' });
  }

  try {
    const channel = await db.group.update({
      where: {
        id: groupid
      },
      data: {
        channel: {
          create: {
            ...data
          }
        }
      },
      select: {
        channel: true
      }
    });

    if (channel) {
      return res.status(200).json({ channel });
    }

    return res.status(400).json({ message: 'Oops! something went wrong' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const onUpdateChannelInfo = async (req: Request, res: Response) => {
  const { channelid } = req.query as { channelid: string };
  const { name, icon } = req.body;
  try {
    if (name) {
      const channel = await db.channel.update({
        where: {
          id: channelid
        },
        data: {
          name
        }
      });

      if (channel) {
        return res.status(200).json({
          message: 'Channel name successfully updated'
        });
      }
      return res
        .status(404)
        .json({ message: 'Channel not found! try again later' });
    }
    if (icon) {
      const channel = await db.channel.update({
        where: {
          id: channelid
        },
        data: {
          icon
        }
      });
      if (channel) {
        return {
          status: 200,
          message: 'Channel icon successfully updated'
        };
      }
      return {
        status: 404,
        message: 'Channel not found! try again later'
      };
    } else {
      const channel = await db.channel.update({
        where: {
          id: channelid
        },
        data: {
          icon,
          name
        }
      });
      if (channel) {
        return res.status(200).json({
          message: 'Channel name and icon successfully updated'
        });
      }
      return res
        .status(404)
        .json({ message: 'Channel not found! try again later' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const onDeleteChannel = async (req: Request, res: Response) => {
  const { channelId } = req.query as { channelId: string };

  try {
    const channel = await db.channel.delete({
      where: {
        id: channelId
      }
    });

    if (channel) {
      return res.status(200).json({
        message: 'Channel successfully deleted'
      });
    }

    return res.status(400).json({
      message: 'Oops! something went wrong'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
