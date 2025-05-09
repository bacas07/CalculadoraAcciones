import { Request, Response, NextFunction } from 'express';
import EurUsdService from '../models/eurUsd.model.js';
import { parse } from 'valibot';
import { stockDataPointSchemaValibot } from '../validators/stockDataPoint.validator.js';
import { IStockDataPoint } from '../types/types.js';

class EurUsdController {
  private service = EurUsdService;

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.getAll();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.service.getById(id);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createOne(req: Request, res: Response, next: NextFunction) {
    try {
      const validData = parse(
        stockDataPointSchemaValibot,
        req.body
      ) as IStockDataPoint;
      const created = await this.service.createOne(validData);
      return res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async createMany(req: Request, res: Response, next: NextFunction) {
    try {
      if (!Array.isArray(req.body)) {
        throw new Error('Se espera un arreglo de objetos');
      }

      const validData: IStockDataPoint[] = (req.body as unknown[]).map(
        (item) => parse(stockDataPointSchemaValibot, item) as IStockDataPoint
      );
      const inserted = await this.service.createMany(validData);
      return res.status(201).json(inserted);
    } catch (error) {
      next(error);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deleted = await this.service.deleteOne(id);
      return res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}

export default new EurUsdController();
