import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as ActivityHandlers from './activities.handlers';
import { Activity } from './activities.model';

const router = Router();

router.get('/', ActivityHandlers.findAll);
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  ActivityHandlers.findOne,
);
router.post(
  '/',
  validateRequest({
    body: Activity,
  }),
  ActivityHandlers.createOne,
);
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Activity,
  }),
  ActivityHandlers.updateOne,
);
router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  ActivityHandlers.deleteOne,
);

export default router;