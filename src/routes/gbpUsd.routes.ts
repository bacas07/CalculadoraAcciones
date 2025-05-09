import { Router, Request, Response, NextFunction } from 'express';
import GbpUsdController from '../controllers/gbpUsd.controller.js';

const GbpUsdRouter = Router();

GbpUsdRouter.get(
  '/getall',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.getAll(req, res, next);
  }
);
GbpUsdRouter.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.getById(req, res, next);
  }
);
GbpUsdRouter.post(
  '/createone',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.createOne(req, res, next);
  }
);
GbpUsdRouter.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.createMany(req, res, next);
  }
);
GbpUsdRouter.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.deleteOne(req, res, next);
  }
);

export default GbpUsdRouter;
