import { Router } from 'express';
import protect from '../middleware/auth-middleware';
import {
  isSubscribed,
  onCreateNewGroup,
  onGetAffiliateInfo,
  onGetAffiliateLink,
  onGetAllGroupMembers,
  onGetCommentReplies,
  onGetExploreGroup,
  onGetGroupChannels,
  onGetGroupInfo,
  onGetGroupSubscriptions,
  onGetPaginatedPosts,
  onGetPostComments,
  onGetPostInfo,
  onGetUserGroups,
  onJoinGroup,
  onSearchGroups,
  onUpdateGroupGallery,
  onUpDateGroupSettings,
  onVerifyAffilateLink
} from '../controllers/groups';

const groupRouter = Router();

groupRouter.route('/onGetAffiliateInfo').get(protect, onGetAffiliateInfo);
groupRouter.route('/onCreateNewGroup').post(protect, onCreateNewGroup);
groupRouter.route('/onGetGroupInfo').get(protect, onGetGroupInfo);
groupRouter.route('/onGetUserGroups').get(protect, onGetUserGroups);
groupRouter.route('/isSubscribed').get(protect, isSubscribed);
groupRouter.route('/onGetGroupChannels').get(onGetGroupChannels);
groupRouter.route('/onGetGroupSubscriptions').get(onGetGroupSubscriptions);
groupRouter.route('/onGetAllGroupMembers').get(protect, onGetAllGroupMembers);
groupRouter.route('/onSearchGroups').post(onSearchGroups);
groupRouter.route('/onUpDateGroupSettings').post(onUpDateGroupSettings);
groupRouter.route('/onGetExploreGroup').post(onGetExploreGroup);
groupRouter.route('/onGetPaginatedPosts').get(onGetPaginatedPosts);
groupRouter.route('/onUpdateGroupGallery').post(protect, onUpdateGroupGallery);
groupRouter.route('/onJoinGroup').get(protect, onJoinGroup);
groupRouter.route('/onGetAffiliateLink').get(onGetAffiliateLink);
groupRouter.route('/onVerifyAffilateLink').get(onVerifyAffilateLink);
groupRouter.route('/onGetPostInfo').get(protect, onGetPostInfo);
groupRouter.route('/onGetPostComments').get(protect, onGetPostComments);
groupRouter.route('/onGetCommentReplies').get(protect, onGetCommentReplies);

export default groupRouter;
