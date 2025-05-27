// routes/analysis.routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import AnalysisController from '../controllers/analysis.controller.js';

const AnalysisRouter = Router();

AnalysisRouter.get(
  '/linear-regression/:symbol/:windowSize',
  (req: Request, res: Response, next: NextFunction) => {
    AnalysisController.getLinearRegression(req, res, next);
  }
);

export default AnalysisRouter;
