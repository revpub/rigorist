import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { UserWithId, Users, User, UserPartial, UserPartialWithId } from './users.model';
import { UserController } from './users.controller';

export async function findAll(req: Request, res: Response<UserWithId[]>, next: NextFunction) {
  try {
    const users = await Users.find().toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, UserWithId, User>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const insertOneResult = await UserController.insertOne(req.body);
    res.status(201);
    res.json(insertOneResult);
  } catch (error) {
    next(error);    
  }
}

export async function findOne(req: Request<ParamsWithId, UserWithId, {}>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const result = await Users.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, UserWithId, UserPartial>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const result = await Users.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Users.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  } 
}