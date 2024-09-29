import { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../utils/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2024-06-20'
});

export const onConnectStipe = async (req: Request, res: Response) => {
  const { groupid } = req.query as { groupid: string };

  try {
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'US',
      business_type: 'individual'
    });

    if (account) {
      const user = req.user;
      const integrateStripeAccount = await db.user.update({
        where: {
          id: user.id
        },
        data: {
          stripeId: account.id
        }
      });
      if (integrateStripeAccount) {
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: `http://localhost:3000/callback/stripe/refresh`,
          return_url: `http://localhost:3000/group/${groupid}/settings/integrations`,
          type: 'account_onboarding'
        });
        return res.status(200).json({ url: accountLink.url });
      }

      return res.status(400).json({
        message: 'Failed to integrate Stripe account'
      });
    }

    return res.status(400).json({
      message: 'Failed to create Stripe account'
    });
  } catch (error) {
    console.log(error);
    // WIP: FIX STRIPE CONNECT ACCOUNT ERROR
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
