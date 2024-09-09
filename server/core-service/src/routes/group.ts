import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import {
  onCreateNewGroup,
  onGetAffiliateInfo,
  onGetAllGroupMembers,
  onGetGroupChannels,
  onGetGroupInfo,
  onGetGroupSubscriptions,
  onGetUserGroups,
  onSearchGroups
} from '../controllers/groups';

const groupRouter = Router();

groupRouter.route('/onGetAffiliateInfo').get(protect, onGetAffiliateInfo);
groupRouter.route('/onCreateNewGroup').post(protect, onCreateNewGroup);
groupRouter.route('/onGetGroupInfo').get(protect, onGetGroupInfo);
groupRouter.route('/onGetUserGroups').get(protect, onGetUserGroups);
groupRouter.route('/onGetGroupChannels').get(onGetGroupChannels);
groupRouter.route('/onGetGroupSubscriptions').get(onGetGroupSubscriptions);
groupRouter.route('/onGetAllGroupMembers').get(protect, onGetAllGroupMembers);
groupRouter.route('onSearchGroups').post(protect, onSearchGroups);

export default groupRouter;
