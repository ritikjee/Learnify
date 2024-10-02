import { Request, Response } from 'express';
import { db } from '../utils/db';
import { v4 } from 'uuid';

export const onGetChannelInfo = async (req: Request, res: Response) => {
  const { channelid } = req.query as { channelid: string };

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

export const onCreateChannelPost = async (req: Request, res: Response) => {
  const { channelid, title, content, htmlContent, jsonContent } = req.body;
  if (!channelid) {
    return res.status(400).json({ message: 'Channel ID is required' });
  }

  try {
    const user = req.user;
    const post = await db.post.create({
      data: {
        id: v4(),
        authorId: user.id!,
        channelId: channelid,
        title,
        content,
        htmlContent,
        jsonContent
      }
    });

    if (post) {
      return res.status(200).json({ message: 'Post successfully created' });
    }

    return res.status(404).json({ message: 'Channel not found' });
  } catch (error) {
    return res.status(400).json({ message: 'Oops! something went wrong' });
  }
};

export const onLikeChannelPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { postid, likeid } = req.body;

    if (!postid) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    if (!likeid) {
      return res.status(400).json({ message: 'Like ID is required' });
    }

    const liked = await db.like.findFirst({
      where: {
        id: likeid,
        userId: user.id!
      }
    });

    if (liked) {
      await db.like.delete({
        where: {
          id: likeid,
          userId: user.id
        }
      });

      return res.status(200).json({ message: 'You unliked this post' });
    }

    const like = await db.like.create({
      data: {
        id: likeid,
        postId: postid,
        userId: user.id!
      }
    });

    if (like) return res.status(200).json({ message: 'You liked this post' });

    return res.status(400).json({ message: 'Oops! something went wrong' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const onCreateNewComment = async (req: Request, res: Response) => {
  const { postid, content, commentid } = req.body;
  if (!postid || !content || !commentid) {
    return res.status(400).json({ message: 'Invalid Input' });
  }
  try {
    const user = req.user;
    const comment = await db.post.update({
      where: {
        id: postid
      },
      data: {
        comments: {
          create: {
            id: commentid,
            content,
            userId: user.id!
          }
        }
      }
    });
    if (comment) {
      return res.status(200).json({ message: 'Comment posted' });
    }
    return res.status(400).json({ message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const onCreateCommentReply = async (req: Request, res: Response) => {
  const { postid, commentid, replyid, comment } = req.body;
  if (!postid || !commentid || !replyid || !comment) {
    return res.status(400).json({ message: 'Invalid Input' });
  }
  try {
    const user = req.user;
    const reply = await db.comment.update({
      where: {
        id: commentid
      },
      data: {
        reply: {
          create: {
            content: comment,
            id: replyid,
            postId: postid,
            userId: user.id!,
            replied: true
          }
        }
      }
    });

    if (reply) {
      return res.status(200).json({ message: 'Reply posted' });
    }
    return res.status(400).json({ message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
