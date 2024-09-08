import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import { onGetAffiliateInfo } from '../controllers/groups';

const groupRouter = Router();

groupRouter.route('/onGetAffiliateInfo').get(protect, onGetAffiliateInfo);

export default groupRouter;
