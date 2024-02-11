import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { TimeEntryWithId, TimeEntries, TimeEntry } from './timeEntries.model';
import { TimeEntryController } from './timeEntries.controller';

export async function find(req: Request, res: Response<TimeEntryWithId[]>, next: NextFunction) {
  try {
    if (req.query) {
      findByActorIdAndDates(req, res, next);
    }
    else {
      findAll(req, res, next);
    }
  } catch (error) {
    next(error);
  }

}

export async function findAll(req: Request, res: Response<TimeEntryWithId[]>, next: NextFunction) {
  try {
    const timeEntries = await TimeEntries.find().toArray();
    res.json(timeEntries);
  } catch (error) {
    next(error);
  }
}

export async function findByActorIdAndDates(req: Request, res: Response<TimeEntryWithId[]>, next: NextFunction) {
  const actorId = new ObjectId(req.query.actorId as string);
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  try {
    const timeEntries = await TimeEntries.find({
      actorId: actorId,
      dateString: {
        $gte: startDate,
        $lte: endDate
      }
    }).toArray();
    res.json(timeEntries);
  } catch (error) {
    next(error);
  }
}

export async function findWithActorId(req: Request, res: Response<TimeEntryWithId[]>, next: NextFunction) {
  const actorId = new ObjectId(req.query.actorId as string);
  try {
    const timeEntries = await TimeEntries.find({
      actorId: actorId
    }).toArray();
    res.json(timeEntries);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, TimeEntryWithId, TimeEntry>, res: Response<TimeEntryWithId>, next: NextFunction) {
  try {
    const insertOneResult = await TimeEntryController.insertOne(req.body);
    res.status(201);
    res.json(insertOneResult);
  } catch (error) {
    next(error);    
  }
}

export async function findOne(req: Request<ParamsWithId, TimeEntryWithId, {}>, res: Response<TimeEntryWithId>, next: NextFunction) {
  try {
    const result = await TimeEntries.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Time entry with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, TimeEntryWithId, TimeEntry>, res: Response<TimeEntryWithId>, next: NextFunction) {
  try {
    const result = await TimeEntries.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Time entry with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await TimeEntries.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Time entry with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  } 
}