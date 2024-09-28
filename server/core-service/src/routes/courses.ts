import { Router } from 'express';
import { onCreateGroupCourse, onGetGroupCourses } from '../controllers/courses';

const courseRouter = Router();

courseRouter.route('/onGetGroupCourses').get(onGetGroupCourses);
courseRouter.route('/onCreateGroupCourse').post(onCreateGroupCourse);

export default courseRouter;
