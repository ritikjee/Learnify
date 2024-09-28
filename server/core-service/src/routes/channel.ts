import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import {
  onCreateChannelPost,
  onCreateNewChannel,
  onDeleteChannel,
  onGetChannelInfo,
  onLikeChannelPost,
  onUpdateChannelInfo
} from '../controllers/channel';

const channelRouter = Router();

channelRouter.route('/onGetChannelInfo').get(protect, onGetChannelInfo);
channelRouter.route('/onCreateNewChannel').post(protect, onCreateNewChannel);
channelRouter.route('/onUpdateChannelInfo').put(protect, onUpdateChannelInfo);
channelRouter.route('/onDeleteChannel').delete(protect, onDeleteChannel);
channelRouter.route('/onCreateChannelPost').post(protect, onCreateChannelPost);
channelRouter.route('/onLikeChannelPost').post(protect, onLikeChannelPost);

export default channelRouter;
