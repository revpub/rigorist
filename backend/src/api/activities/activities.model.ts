import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const Activity = z.object({
  name: z.string().min(1),
});

export type Activity = z.infer<typeof Activity>;
export type ActivityWithId = WithId<Activity>;
export const Activities = db.collection<Activity>('activities');