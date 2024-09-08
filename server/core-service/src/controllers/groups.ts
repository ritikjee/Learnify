import { Request, Response } from 'express';
import { db } from '../utils/db';

export const onGetAffiliateInfo = async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id } = req.query as { id: string };

  if (!id) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }

  try {
    const affiliateInfo = await db.affiliate.findUnique({
      where: {
        id,
        Group: {
          User: {
            id: userId
          }
        }
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
