import { Router } from 'express';
import {
  onCreateNewGroupSubscription,
  onGetStripeClientSecret,
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

export default paymentRouter;
