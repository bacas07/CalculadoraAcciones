import { Router, Request, Response, NextFunction } from 'express';
import UsdJpyController from '../controllers/eurUsd.controller.js';

const router = Router();

router.get('/getall', (req: Request, res: Response, next: NextFunction) => {
  UsdJpyController.getAll(req, res, next);
});
router.get(
  '/getbyid/:id',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.getById(req, res, next);
  }
);
router.post('/createone', (req: Request, res: Response, next: NextFunction) => {
  UsdJpyController.createOne(req, res, next);
});
router.post(
  '/createmany',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.createMany(req, res, next);
  }
);
router.delete(
  '/deleteone',
  (req: Request, res: Response, next: NextFunction) => {
    UsdJpyController.deleteOne(req, res, next);
  }
);
