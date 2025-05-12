import { Router, Request, Response, NextFunction } from 'express';
import EurUsdController from '../controllers/eurUsd.controller.js';

const EurUsdRouter = Router();

EurUsdRouter.get(
  '/getall',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.getAll(req, res, next);
  }
);
EurUsdRouter.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.getById(req, res, next);
  }
);
EurUsdRouter.post(
  '/createone',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.createOne(req, res, next);
  }
);
EurUsdRouter.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.createMany(req, res, next);
  }
);
EurUsdRouter.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.deleteOne(req, res, next);
  }
);
EurUsdRouter.get(
  '/bulkinsert',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.bulkInsert(req, res, next)
  }
)

export default EurUsdRouter;
