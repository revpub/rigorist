import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import users from './users/users.routes';
import activities from './activities/activities.routes';
import timeEntries from './timeEntries/timeEntries.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/users', users);
router.use('/activities', activities);
router.use('/timeEntries', timeEntries);

export default router;
