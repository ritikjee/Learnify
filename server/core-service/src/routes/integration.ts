import { Router } from 'express';
import { onConnectStipe } from '../controllers/integration';

const integrationsRouter = Router();

integrationsRouter.route('/stripe').get(onConnectStipe);

export default integrationsRouter;
