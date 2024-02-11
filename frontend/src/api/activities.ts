import * as z from 'zod';
import { ObjectId } from 'bson';
import axios from "axios";

const Activity = z.object({
  name: z.string().min(1),
});

const ActivityWithId = Activity.extend({
  _id: z.instanceof(ObjectId)
});

export type Activity = z.infer<typeof Activity>;
export type ActivityWithId = z.infer<typeof ActivityWithId>;

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const createActivity = (
  activity: Activity,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/activities`,
    activity,
    defaultJsonOptions
  )
    .then((response) => {
      if (response.status === 201) {
        onSuccess();
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));
};

export const getAllActivities = (
  onSuccess: (activitiesWithId: ActivityWithId[]) => void,
  onFailure: () => void
) => {
  axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/activities`,
    defaultJsonOptions
  )
    .then((response) => {
      if (response.status === 200) {
        onSuccess(response.data);
      } else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));
};