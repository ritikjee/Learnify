import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import {
  onCreateNewChannel,
  onDeleteChannel,
  onGetChannelInfo,
  onUpdateChannelInfo
} from '../controllers/channel';

const channelRouter = Router();

channelRouter.route('/onGetChannelInfo').get(protect, onGetChannelInfo);
channelRouter.route('/onCreateNewChannel').post(protect, onCreateNewChannel);
channelRouter.route('/onUpdateChannelInfo').put(protect, onUpdateChannelInfo);
channelRouter.route('/onDeleteChannel').delete(protect, onDeleteChannel);

export default channelRouter;
