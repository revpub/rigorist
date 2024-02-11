import { TimeEntryWithId, TimeEntries, TimeEntry } from './timeEntries.model';

export class TimeEntryController {

  public static insertOne = async (timeEntry: TimeEntry): Promise<TimeEntryWithId> => {
    const insertResult = await TimeEntries.insertOne(timeEntry);
    if (!insertResult.acknowledged) throw new Error('Error inserting activity.');
    const timeEntryWithId: TimeEntryWithId = {
      _id: insertResult.insertedId,
      ...timeEntry
    };
    return timeEntryWithId;
  }

}