import { Request, Response, NextFunction } from 'express';
import UsdJpyService from '../models/usdJpy.model.js';
import { parse } from 'valibot';
import { stockDataPointSchemaValibot } from '../validators/stockDataPoint.validator.js';
import { IStockDataPoint } from '../types/types.js';
import ApiError from '../errors/apiError.js'; // Importamos ApiError con el nombre corregido

class UsdJpyController {
  private service = UsdJpyService;

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
      try {
        const validData = parse(
          stockDataPointSchemaValibot,
          req.body
        ) as IStockDataPoint;
        const created = await this.service.createOne(validData);
        return res.status(201).json(created);
      } catch (validationError) {
        throw new ApiError(
          'Error de validación en los datos',
          400,
          validationError
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async createMany(req: Request, res: Response, next: NextFunction) {
    try {
      if (!Array.isArray(req.body)) {
        throw new ApiError('Se espera un arreglo de objetos', 400);
      }

      try {
        const validData: IStockDataPoint[] = (req.body as unknown[]).map(
          (item) => parse(stockDataPointSchemaValibot, item) as IStockDataPoint
        );
        const inserted = await this.service.createMany(validData);
        return res.status(201).json(inserted);
      } catch (validationError) {
        throw new ApiError(
          'Error de validación en los datos del arreglo',
          400,
          validationError
        );
      }
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

export default new UsdJpyController();
