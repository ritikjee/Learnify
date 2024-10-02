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
        groupOwner: user?.id === group.userId ? true : false
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

export const onUpDateGroupSettings = async (req: Request, res: Response) => {
  const { groupid, content, type } = req.body;
  try {
    if (type === 'IMAGE') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          thumbnail: content
        }
      });
    }
    if (type === 'ICON') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          icon: content
        }
      });
    }
    if (type === 'DESCRIPTION') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          description: content
        }
      });
    }
    if (type === 'NAME') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          name: content
        }
      });
    }
    if (type === 'JSONDESCRIPTION') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          jsonDescription: content
        }
      });
    }
    if (type === 'HTMLDESCRIPTION') {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          htmlDescription: content
        }
      });
    }

    return res.status(200).json({
      message: 'Update successful'
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error updating group'
    });
  }
};

export const onGetExploreGroup = async (req: Request, res: Response) => {
  const { category, paginate } = req.body;
  try {
    const groups = await db.group.findMany({
      where: {
        category,
        NOT: {
          description: null,
          thumbnail: null
        }
      },
      take: 6,
      skip: paginate
    });

    if (groups && groups.length > 0) {
      return res.status(200).json({
        groups
      });
    }

    return res.status(400).json({
      message: 'No group found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'OOPS! Something went wrong'
    });
  }
};

export const onGetPaginatedPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { identifier, paginate } = req.query as {
      identifier: string;
      paginate: string;
    };
    if (!identifier || !paginate) {
      return res.status(400).json({
        message: 'Bad Request'
      });
    }
    const posts = await db.post.findMany({
      where: {
        channelId: identifier
      },
      skip: Number(paginate) || 0,
      take: 2,
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
    });

    if (posts && posts.length > 0)
      return res.status(200).json({
        posts
      });

    return res.status(404).json({
      message: 'No posts found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onUpdateGroupGallery = async (req: Request, res: Response) => {
  const { groupid, content } = req.body;

  if (!groupid || !content) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const mediaLimit = await db.group.findUnique({
      where: {
        id: groupid
      },
      select: {
        gallery: true
      }
    });

    if (mediaLimit && mediaLimit?.gallery.length < 6) {
      await db.group.update({
        where: {
          id: groupid
        },
        data: {
          gallery: {
            push: content
          }
        }
      });

      return res.status(200).json({
        message: 'Media uploaded successfully'
      });
    }

    return res.status(400).json({
      message: 'Looks like your gallery has the maximum media allowed'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onJoinGroup = async (req: Request, res: Response) => {
  const { groupid } = req.query as {
    groupid: string;
  };

  if (!groupid) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }

  try {
    const user = req.user;
    const member = await db.group.update({
      where: {
        id: groupid
      },
      data: {
        member: {
          create: {
            userId: user.id
          }
        }
      }
    });
    if (member) {
      return res.status(200).json({
        message: 'You have joined this group'
      });
    }
    return res.status(400).json({
      message: 'Error joining group'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onGetAffiliateLink = async (req: Request, res: Response) => {
  const { groupid } = req.query as { groupid: string };
  if (!groupid) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const affiliate = await db.affiliate.findUnique({
      where: {
        groupId: groupid
      },
      select: {
        id: true
      }
    });

    if (affiliate)
      return res.status(200).json({
        affiliate
      });

    return res.status(400).json({
      message: 'No affiliate link found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onVerifyAffilateLink = async (req: Request, res: Response) => {
  const { id } = req.query as { id: string };
  if (!id) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const link = await db.affiliate.findUnique({
      where: {
        id
      }
    });

    if (link) {
      return res.status(200).json({
        message: 'Affiliate link verified'
      });
    }

    return res.status(400).json({
      message: 'Invalid affiliate link'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const isSubscribed = async (req: Request, res: Response) => {
  const { groupid } = req.query as {
    groupid: string;
  };

  if (!groupid) {
    return res.status(400).json({
      message: 'Please provide a valid groupid'
    });
  }

  const user = req.user;
  try {
    const userInfo = await db.group.findFirst({
      where: {
        id: groupid
      },
      include: {
        member: true
      }
    });
    const subscription = userInfo?.member.map((mem) => mem.id == user.id);
    if (subscription) {
      return res.status(200).json({
        subscribed: true,
        message: 'User is subscribed to the group'
      });
    } else {
      return res.status(200).json({
        subscribed: false,
        message: 'User is not subscribed to the group'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onGetPostInfo = async (req: Request, res: Response) => {
  const { postid } = req.query as { postid: string };

  if (!postid) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const user = req.user;
    const post = await db.post.findUnique({
      where: {
        id: postid
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
        },
        comments: true
      }
    });

    if (post) return res.status(200).json({ post });

    return res.status(404).json({
      message: 'Post not found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onGetPostComments = async (req: Request, res: Response) => {
  const { postid } = req.query as { postid: string };
  if (!postid) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const comments = await db.comment.findMany({
      where: {
        postId: postid,
        replied: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        _count: {
          select: {
            reply: true
          }
        }
      }
    });

    if (comments && comments.length > 0) {
      return res.status(200).json({
        comments
      });
    }
    return res.status(404).json({
      message: 'No comments found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};

export const onGetCommentReplies = async (req: Request, res: Response) => {
  const { commentid } = req.query as { commentid: string };
  if (!commentid) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  try {
    const replies = await db.comment.findUnique({
      where: {
        id: commentid
      },
      select: {
        reply: {
          include: {
            user: true
          }
        }
      }
    });

    if (replies && replies.reply.length > 0) {
      return res.status(200).json({
        replies
      });
    }

    return res.status(404).json({
      message: 'No replies found'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
};
