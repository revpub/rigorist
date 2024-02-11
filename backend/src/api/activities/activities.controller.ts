import { ActivityWithId, Activities, Activity } from './activities.model';

export class ActivityController {

  public static insertOne = async (activity: Activity): Promise<ActivityWithId> => {
    const insertResult = await Activities.insertOne(activity);
    if (!insertResult.acknowledged) throw new Error('Error inserting activity.');
    const activityWithId: ActivityWithId = {
      _id: insertResult.insertedId,
      ...activity
    };
    return activityWithId;
  }

  public static findOneByName = async (name: string): Promise<ActivityWithId> => {
    const activityWithId = await Activities.findOne({
      name: name
    });
    if (!activityWithId) throw new Error('Error finding activity by name.');
    return activityWithId;
  }

}