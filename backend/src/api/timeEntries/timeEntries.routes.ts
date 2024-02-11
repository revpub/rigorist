import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { OptionalActorIdAndDates } from '../../interfaces/OptionalActorIdAndDates';
import { ActorId } from '../../interfaces/ActorId';

import { validateRequest } from '../../middlewares';
import * as TimeEntryHandlers from './timeEntries.handlers';
import { TimeEntry, TimeEntryPartial } from './timeEntries.model';

const router = Router();

router.get(
  '/withActorId',
  validateRequest({
    query: ActorId,
  }),
  TimeEntryHandlers.findWithActorId
);
router.get(
  '/',
  validateRequest({
    query: OptionalActorIdAndDates,
  }),
  TimeEntryHandlers.find
);
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  TimeEntryHandlers.findOne,
);
router.post(
  '/',
  validateRequest({
    body: TimeEntry,
  }),
  TimeEntryHandlers.createOne,
);
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: TimeEntryPartial,
  }),
  TimeEntryHandlers.updateOne,
);
router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  TimeEntryHandlers.deleteOne,
);

export default router;