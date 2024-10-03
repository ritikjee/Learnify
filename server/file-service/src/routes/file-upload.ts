import { Router } from 'express';
import { uploadFile } from '../controllers/upload-file';

const fileRouter = Router();

fileRouter.route('/upload').post(uploadFile);

export default fileRouter;
