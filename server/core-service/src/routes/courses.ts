import { Router } from 'express';
import {
  onCreateCourseModule,
  onCreateGroupCourse,
  onCreateModuleSection,
  onGetCourseModules,
  onGetGroupCourses,
  onGetSectionInfo,
  onUpdateCourseSectionContent,
  onUpdateModule,
  onUpdateSection
} from '../controllers/courses';

const courseRouter = Router();

courseRouter.route('/onGetGroupCourses').get(onGetGroupCourses);
courseRouter.route('/onCreateGroupCourse').post(onCreateGroupCourse);
courseRouter.route('/onGetCourseModules').get(onGetCourseModules);
courseRouter.route('/onCreateCourseModule').post(onCreateCourseModule);
courseRouter.route('/onUpdateModule').put(onUpdateModule);
courseRouter.route('/onUpdateSection').put(onUpdateSection);
courseRouter.route('/onCreateModuleSection').post(onCreateModuleSection);
courseRouter.route('/onGetSectionInfo').get(onGetSectionInfo);
courseRouter
  .route('/onUpdateCourseSectionContent')
  .put(onUpdateCourseSectionContent);

export default courseRouter;
