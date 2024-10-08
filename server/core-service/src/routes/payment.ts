import { Router } from 'express';
import {
  onActivateSubscription,
  onCreateNewGroupSubscription,
  onGetActiveSubscription,
  onGetGroupSubscriptionPaymentIntent,
  onGetStripeClientSecret,
  onGetStripeIntegration,
  onTransferCommission
} from '../controllers/payment';
import protect from '../middleware/auth-middleware';

const paymentRouter = Router();

paymentRouter.get('/client-secret', protect, onGetStripeClientSecret);
paymentRouter.post(
  '/create-subscription',
  protect,
  onCreateNewGroupSubscription
);
paymentRouter.post('/transfer-commission', onTransferCommission);
paymentRouter.route('/onGetActiveSubscription').get(onGetActiveSubscription);
paymentRouter
  .route('/onGetGroupSubscriptionPaymentIntent')
  .get(onGetGroupSubscriptionPaymentIntent);
paymentRouter.route('/onActivateSubscription').get(onActivateSubscription);
paymentRouter
  .route('/onGetStripeIntegration')
  .get(protect, onGetStripeIntegration);

export default paymentRouter;
