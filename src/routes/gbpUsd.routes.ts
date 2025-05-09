import { Router, Request, Response, NextFunction } from 'express';
import GbpUsdController from '../controllers/gbpUsd.controller.js';

const router = Router();

router.get('/getall', (req: Request, res: Response, next: NextFunction) => {
  GbpUsdController.getAll(req, res, next);
});
router.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.getById(req, res, next);
  }
);
router.post('/createone', (req: Request, res: Response, next: NextFunction) => {
  GbpUsdController.createOne(req, res, next);
});
router.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.createMany(req, res, next);
  }
);
router.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    GbpUsdController.deleteOne(req, res, next);
  }
);
