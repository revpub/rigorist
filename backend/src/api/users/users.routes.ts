import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as UserHandlers from './users.handlers';
import { User, UserPartial } from './users.model';

const router = Router();

router.get('/', UserHandlers.findAll);
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  UserHandlers.findOne,
);
router.post(
  '/',
  validateRequest({
    body: User,
  }),
  UserHandlers.createOne,
);
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: UserPartial,
  }),
  UserHandlers.updateOne,
);
router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  UserHandlers.deleteOne,
);

export default router;