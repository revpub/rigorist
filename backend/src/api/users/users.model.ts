import { WithId } from 'mongodb';
import * as z from 'zod';

import { db } from '../../db';

export const User = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

export const UserPartial = User.partial();

export type User = z.infer<typeof User>;
export type UserWithId = WithId<User>;
export type UserPartial = z.infer<typeof UserPartial>;
export type UserPartialWithId = WithId<UserPartial>;

export const Users = db.collection<User>('users');