import { Request, Response } from 'express';
import { db } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const onGetAffiliateInfo = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };

  if (!id) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }

  try {
    const affiliateInfo = await db.affiliate.findUnique({
      where: {
        id
      },
      select: {
        Group: {
          select: {
            User: {
              select: {
                firstname: true,
                lastname: true,
                image: true,
                id: true,
                stripeId: true
              }
            }
          }
        }
      }
    });

    if (affiliateInfo) {
      return res.status(200).json(affiliateInfo);
    }

    return res.status(400).json({
      message: 'Affiliate not found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onCreateNewGroup = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const created = await db.user.update({
      where: {
        id: userId
      },
      data: {
        group: {
          create: {
            ...data,
            affiliate: {
              create: {}
            },
            member: {
              create: {
                userId: userId
              }
            },
            channel: {
              create: [
                {
                  id: uuidv4(),
                  name: 'general',
                  icon: 'general'
                },
                {
                  id: uuidv4(),
                  name: 'announcements',
                  icon: 'announcement'
                }
              ]
            }
          }
        }
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

    if (created) {
      return res.status(200).json({
        data: created,
        message: 'Group created successfully'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Oops! group creation failed, try again later'
    });
  }
};

export const onGetGroupInfo = async (req: Request, res: Response) => {
  const user = req.user;

  const { groupid } = req.query as { groupid: string };

  if (!groupid) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }

  try {
    const group = await db.group.findUnique({
      where: {
        id: groupid
      }
    });

    if (group)
      return res.status(200).json({
        group,
        groupOwner: user.id === group.userId ? true : false
      });

    return res.status(400).json({
      message: 'No group found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Oops! something went wrong'
    });
  }
};

export const onGetUserGroups = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const groups = await db.user.findUnique({
      where: {
        id
      },
      select: {
        group: {
          select: {
            id: true,
            name: true,
            icon: true,
            channel: {
              where: {
                name: 'general'
              },
              select: {
                id: true
              }
            }
          }
        },
        membership: {
          select: {
            Group: {
              select: {
                id: true,
                icon: true,
                name: true,
                channel: {
                  where: {
                    name: 'general'
                  },
                  select: {
                    id: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (groups && (groups.group.length > 0 || groups.membership.length > 0)) {
      return res.status(200).json({
        groups: groups.group,
        members: groups.membership
      });
    }

    return res.status(400).json({
      message: 'Error fetching data'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};

export const onGetGroupChannels = async (req: Request, res: Response) => {
  const { groupid } = req.query as {
    groupid: string;
  };

  if (!groupid) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }
  try {
    const channels = await db.channel.findMany({
      where: {
        groupId: groupid
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return res.status(200).json({
      channels
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};

export const onGetGroupSubscriptions = async (req: Request, res: Response) => {
  const { groupid } = req.query as {
    groupid: string;
  };
  if (!groupid) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }

  try {
    const subscriptions = await db.subscription.findMany({
      where: {
        groupId: groupid
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const count = await db.members.count({
      where: {
        groupId: groupid
      }
    });

    if (subscriptions) {
      return res.status(200).json({ subscriptions, count });
    }
    return res.status(400).json({
      message: 'OOPS! Something went wrong'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};

export const onGetAllGroupMembers = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { groupid } = req.query as {
      groupid: string;
    };

    if (!groupid) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    const members = await db.members.findMany({
      where: {
        groupId: groupid,
        NOT: {
          userId: user.id
        }
      },
      include: {
        User: true
      }
    });

    if (members && members.length > 0) {
      return res.status(200).json({ members });
    }

    return res.status(400).json({
      message: 'Can not get group memebrs'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};

export const onSearchGroups = async (req: Request, res: Response) => {
  const { query, mode, paginate } = req.body;
  try {
    if (mode === 'GROUPS') {
      const fetchedGroups = await db.group.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        take: 6,
        skip: paginate || 0
      });

      if (fetchedGroups) {
        if (fetchedGroups.length > 0) {
          return res.status(200).json({ groups: fetchedGroups });
        }

        return res.status(400).json({ message: 'No group found' });
      }
    }
    if (mode === 'POSTS') {
      const fetchedPosts = await db.message.findMany({
        where: {
          message: {
            contains: query,
            mode: 'insensitive'
          }
        },
        take: 6,
        skip: paginate || 0
      });

      if (fetchedPosts.length > 0) {
        return res.status(200).json({
          posts: fetchedPosts
        });
      }
      return res.status(400).json({ message: 'No posts found' });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};
