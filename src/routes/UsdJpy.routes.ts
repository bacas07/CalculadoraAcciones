import { Router, Request, Response, NextFunction } from 'express';
import UsdJpyController from '../controllers/eurUsd.controller.js';

const UsdJpyRouter = Router();

UsdJpyRouter.get(
  '/getall',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.getAll(req, res, next);
  }
);
UsdJpyRouter.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.getById(req, res, next);
  }
);
UsdJpyRouter.post(
  '/createone',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.createOne(req, res, next);
  }
);
UsdJpyRouter.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.createMany(req, res, next);
  }
);
UsdJpyRouter.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.deleteOne(req, res, next);
  }
);
UsdJpyRouter.get(
  '/bulkinsert',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.bulkInsert(req, res, next);
  }
);

export default UsdJpyRouter;
