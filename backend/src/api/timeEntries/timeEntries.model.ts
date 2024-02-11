import { WithId, ObjectId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

// export const TimeEntry = z.object({
//   actorId: z.instanceof(ObjectId).or( z.string().transform( ObjectId.createFromHexString ) ),
//   dateString: z.string(),
//   activityId: z.instanceof(ObjectId).or( z.string().transform( ObjectId.createFromHexString ) ),
//   activityName: z.string().optional(),
//   duration: z.number().min(0.0).max(24.0),
//   concentrationLevel: z.number().int().min(1).max(5)
// });

// export type TimeEntry = z.infer<typeof TimeEntry>;
// export type TimeEntryWithId = WithId<TimeEntry>;

export const TimeEntry = z.object({
  actorId: z.instanceof(ObjectId).or( z.string().transform( ObjectId.createFromHexString ) ),
  dateString: z.string(),
  activityId: z.instanceof(ObjectId).or( z.string().transform( ObjectId.createFromHexString ) ),
  activityName: z.string().optional(),
  duration: z.number().min(0.0).max(24.0),
  concentrationLevel: z.number().int().min(1).max(5)
});

export const TimeEntryWithId = TimeEntry.extend({
  _id: z.instanceof(ObjectId)
});

export const TimeEntryPartial = TimeEntry.partial();

export const TimeEntryPartialWithId = TimeEntryPartial.extend({
  _id: z.instanceof(ObjectId)
});

export type TimeEntry = z.infer<typeof TimeEntry>;
export type TimeEntryWithId = z.infer<typeof TimeEntryWithId>;
export type TimeEntryPartial = z.infer<typeof TimeEntryPartial>;
export type TimeEntryPartialWithId = z.infer<typeof TimeEntryPartialWithId>;

export const TimeEntries = db.collection<TimeEntry>('timeEntries');