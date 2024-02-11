import * as z from 'zod';
import { ObjectId } from 'bson';
import axios from "axios";

const User = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

const UserWithId = User.extend({
  _id: z.instanceof(ObjectId)
});

const UserPartial = User.partial();

const UserPartialWithId = UserPartial.extend({
  _id: z.instanceof(ObjectId)
});

export type User = z.infer<typeof User>;
export type UserWithId = z.infer<typeof UserWithId>;
export type UserPartial = z.infer<typeof UserPartial>;
export type UserPartialWithId = z.infer<typeof UserPartialWithId>;

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const getUser = (
  id: string,
  onSuccess: (user: User) => void,
  onFailure: () => void
) => {

  axios.get(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
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

export const getCurrentUser = (
  onSuccess: (user: User) => void,
  onFailure: () => void
) => {

  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return getUser(currentUserId, onSuccess, onFailure);
  }

};

export const createUser = (
  user: User,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/createUser`,
    user,
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

export const updateUser = (
  id: string,
  user: UserPartial,
  onSuccess: (userWithId: UserWithId) => void,
  onFailure: () => void
) => {

  axios.put(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
    user,
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

export const updateCurrentUser = (
  user: UserPartial,
  onSuccess: (userWithId: UserPartialWithId) => void,
  onFailure: () => void
) => {
  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return updateUser(currentUserId, user, onSuccess, onFailure);
  }
};

export const deleteUser = (
  id: string,
  onSuccess: () => void,
  onFailure: () => void
) => {
  axios.delete(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${id}`,
  defaultJsonOptions
  )
  .then((response) => {
    if (response.status === 204) {
      onSuccess();
    } else {
      onFailure();
    }
  })
  .catch((error) => console.log(error));
};

export const deleteCurrentUser = (
  onSuccess: () => void,
  onFailure: () => void
) => {
  const currentUserId = localStorage.getItem("user-id");
  if (currentUserId !== null) {
    return deleteUser(currentUserId, onSuccess, onFailure);
  }
}