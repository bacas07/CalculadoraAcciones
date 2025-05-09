import { Router, Request, Response, NextFunction } from 'express';
import EurUsdController from '../controllers/eurUsd.controller.js';

const router = Router();

router.get('/getall', (req: Request, res: Response, next: NextFunction) => {
  EurUsdController.getAll(req, res, next);
});
router.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.getById(req, res, next);
  }
);
router.post('/createone', (req: Request, res: Response, next: NextFunction) => {
  EurUsdController.createOne(req, res, next);
});
router.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.createMany(req, res, next);
  }
);
router.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    EurUsdController.deleteOne(req, res, next);
  }
);
