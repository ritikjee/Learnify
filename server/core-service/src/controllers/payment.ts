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
