import { UsdJpyModel } from '../schemas/stockData.schema.js'; // Corregí la importación para usar solo UsdJpyModel
import type { IStockDataPoint } from '../types/types.js';
import { Types } from 'mongoose';
import ApiError from '../errors/apiError.js'; // Importamos ApiError con el nombre corregido

class UsdJpyService {
  private model = UsdJpyModel;

  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      const result = await this.model.find();
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error UsdJpy model getAll: ${(error as Error).message}`,
        500
      );
    }
  }

  async getById(id: string): Promise<IStockDataPoint | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(`Id invalido: ${id}`, 400);
      }

      const result = await this.model.findById(id);

      if (!result) {
        throw new ApiError(
          `No se encontraron registros para el id: ${id}`,
          404
        );
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error UsdJpy model getById: ${(error as Error).message}`,
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
        `Error UsdJpy model createOne: ${(error as Error).message}`,
        500,
        error
      );
    }
  }

  async createMany(data: IStockDataPoint[]): Promise<IStockDataPoint[] | null> {
    try {
      // Corregí esto para usar this.model en lugar de EurUsdModel
      const inserted = await this.model.insertMany(data, { ordered: false });
      return inserted;
    } catch (error) {
      throw new ApiError(
        `Error UsdJpy model createMany: ${(error as Error).message}`,
        500,
        error
      );
    }
  }

  async deleteOne(id: string): Promise<IStockDataPoint | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(`Id invalido: ${id}`, 400);
      }

      const deleted = await this.model.findByIdAndDelete(id);

      if (!deleted) {
        throw new ApiError(
          `No se encontraron registros para el id: ${id}`,
          404
        );
      }

      return deleted;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Error UsdJpy model deleteOne: ${(error as Error).message}`,
        500
      );
    }
  }
}

export default new UsdJpyService();
