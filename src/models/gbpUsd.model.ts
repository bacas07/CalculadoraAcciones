import { GbpUsdModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';
import { Types } from 'mongoose';
import ApiError from '../errors/apiError.js'; // Importamos ApiError con el nombre corregido

class GbpUsdService {
  private model = GbpUsdModel;

  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      const result = await this.model.find();

      if (!result) {
        throw new ApiError('No se encontraron registros para GbpUsd', 404);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error GbpUsd model getAll: ${(error as Error).message}`, 
        500
      );
    }
  }

  async getById(id: string): Promise<IStockDataPoint | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(`ID invalido: ${id}`, 400);
      }

      const result = await this.model.findById(id);

      if (!result) {
        throw new ApiError(`No se encontraron registros para el id: ${id}`, 404);
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error GbpUsd model getOneByid: ${(error as Error).message}`, 
        500
      );
    }
  }

  async createOne(data: IStockDataPoint): Promise<IStockDataPoint | null> {
    try {
      const created = await this.model.create(data);
      return created;
    } catch (error) {
      throw new ApiError(
        `Error GbpUsd model createOne: ${(error as Error).message}`, 
        500, 
        error
      );
    }
  }

  async createMany(data: IStockDataPoint[]): Promise<IStockDataPoint[] | null> {
    try {
      const inserted = await this.model.insertMany(data, { ordered: false });
      return inserted;
    } catch (error) {
      throw new ApiError(
        `Error GpbUsd model createMany: ${(error as Error).message}`, 
        500, 
        error
      );
    }
  }

  async deleteOne(id: string): Promise<IStockDataPoint | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(`ID invalido: ${id}`, 400);
      }

      const deleted = await this.model.findByIdAndDelete(id);

      if (!deleted) {
        throw new ApiError(`No se encontraron registros para el id: ${id}`, 404);
      }

      return deleted;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error GpbUsd model deleteOne: ${(error as Error).message}`, 
        500
      );
    }
  }
}

export default new GbpUsdService();