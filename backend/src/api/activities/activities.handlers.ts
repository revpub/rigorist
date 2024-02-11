import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { ActivityWithId, Activities, Activity } from './activities.model';
import { ActivityController } from './activities.controller';

export async function findAll(req: Request, res: Response<ActivityWithId[]>, next: NextFunction) {
  try {
    const activities = await Activities.find().toArray();
    res.json(activities);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, ActivityWithId, Activity>, res: Response<ActivityWithId>, next: NextFunction) {
  try {
    const insertOneResult = await ActivityController.insertOne(req.body);
    res.status(201);
    res.json(insertOneResult);
  } catch (error) {
    next(error);    
  }
}

export async function findOne(req: Request<ParamsWithId, ActivityWithId, {}>, res: Response<ActivityWithId>, next: NextFunction) {
  try {
    const result = await Activities.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Activity with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, ActivityWithId, Activity>, res: Response<ActivityWithId>, next: NextFunction) {
  try {
    const result = await Activities.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Activity with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Activities.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Activity with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  } 
}