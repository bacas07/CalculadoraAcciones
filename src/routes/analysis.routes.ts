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

AnalysisRouter.get(
  '/interpolate-linear/:symbol/:windowSize',
  (req: Request, res: Response, next: NextFunction) => {
    AnalysisController.getInterpolatedLinearData(req, res, next);
  }
);

AnalysisRouter.get(
  '/interpolate-lagrange/:symbol/:windowSize/:xTarget',
  (req: Request, res: Response, next: NextFunction) => {
    AnalysisController.getLagrangeInterpolation(req, res, next);
  }
);

AnalysisRouter.get(
  '/integrate-trapezoidal/:symbol/:windowSize/:lowerBound/:upperBound/:numSegments?',
  (req: Request, res: Response, next: NextFunction) => {
    AnalysisController.getTrapezoidalIntegral(req, res, next);
  }
);


export default AnalysisRouter;
