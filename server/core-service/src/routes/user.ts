import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import { loggedInUser } from '../controllers/user';

const userRouter = Router();

userRouter.route('/loggedInUser').get(protect, loggedInUser);

export default userRouter;
