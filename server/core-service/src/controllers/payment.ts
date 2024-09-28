import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../utils/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
  apiVersion: '2024-06-20'
});

export const onGetStripeClientSecret = async (req: Request, res: Response) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      amount: 9900,
      automatic_payment_methods: {
        enabled: true
      }
    });

    if (paymentIntent) {
      return res.status(200).json({ secret: paymentIntent.client_secret });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error?.message || 'Something went wrong' });
  }
};

export const onCreateNewGroupSubscription = async (
  req: Request,
  res: Response
) => {
  const { groupid, price } = req.body;

  if (!groupid || !price) {
    return res.status(400).json({ message: 'Bad request' });
  }
  try {
    const subscription = await db.group.update({
      where: {
        id: groupid
      },
      data: {
        subscription: {
          create: {
            price: parseInt(price)
          }
        }
      }
    });

    if (subscription) {
      return res.status(200).json({ message: 'Subscription created' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const onTransferCommission = async (req: Request, res: Response) => {
  const destination = req.body.stripeId;
  if (!destination) {
    return res.status(400).json({ message: 'Bad request' });
  }
  try {
    const transfer = await stripe.transfers.create({
      amount: 3960,
      currency: 'usd',
      destination: destination
    });

    if (transfer) {
      return res.status(200).json({ message: 'Commission transferred' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const onGetActiveSubscription = async (req: Request, res: Response) => {
  const { groupId } = req.query as {
    groupId: string;
  };

  if (!groupId) {
    return res.status(400).json({ message: 'Bad request' });
  }
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        groupId: groupId,
        active: true
      }
    });

    if (subscription) {
      return res.status(200).json({ subscription });
    }
    res.status(404).json({ message: 'Subscription not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const onGetGroupSubscriptionPaymentIntent = async (
  req: Request,
  res: Response
) => {
  const groupid = req.query.groupid as string;

  if (!groupid) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    const price = await db.subscription.findFirst({
      where: {
        groupId: groupid,
        active: true
      },
      select: {
        price: true,
        Group: {
          select: {
            User: {
              select: {
                stripeId: true
              }
            }
          }
        }
      }
    });

    if (price && price.price) {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: price.price * 100,
        automatic_payment_methods: {
          enabled: true
        }
      });

      if (paymentIntent) {
        return res.status(200).json({ secret: paymentIntent.client_secret });
      }

      return res
        .status(400)
        .json({ message: 'Failed to create payment intent' });
    }
    return res.status(404).json({ message: 'Subscription not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const onActivateSubscription = async (req: Request, res: Response) => {
  const { id } = req.query as {
    id: string;
  };

  if (!id) {
    return res.status(400).json({ message: 'Bad request' });
  }

  try {
    const status = await db.subscription.findUnique({
      where: {
        id
      },
      select: {
        active: true
      }
    });
    if (status) {
      if (status.active) {
        return res.status(200).json({ message: 'Subscription already active' });
      }
      if (!status.active) {
        const current = await db.subscription.findFirst({
          where: {
            active: true
          },
          select: {
            id: true
          }
        });
        if (current && current.id) {
          const deactivate = await db.subscription.update({
            where: {
              id: current.id
            },
            data: {
              active: false
            }
          });

          if (deactivate) {
            const activateNew = await db.subscription.update({
              where: {
                id
              },
              data: {
                active: true
              }
            });

            if (activateNew) {
              return res.status(200).json({ message: 'New plan activated' });
            }
          }
        } else {
          const activateNew = await db.subscription.update({
            where: {
              id
            },
            data: {
              active: true
            }
          });

          if (activateNew) {
            return res.status(200).json({ message: 'New plan activated' });
          }
        }
      }
    }
    return res.status(404).json({ message: 'Subscription not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
