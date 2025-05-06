import { EurUsdModel, UsdJpyModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';
import { Types } from 'mongoose';

export default class UsdJpyService {
  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      const result = await UsdJpyModel.find();

      if (!result) {
        throw new Error('No se encontraron registros para UsdJpy');
      }

      return result;
    } catch (error) {
      throw new Error(`Error UsdJpy model getAll: ${(error as Error).message}`);
    }
  }

  async getByID(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Id invalido: ${id}`);
    }

    try {
      const result = await UsdJpyModel.findById(id);

      if (!result) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return result;
    } catch (error) {
      throw new Error(
        `Error UsdJpy model getById: ${(error as Error).message}`
      );
    }
  }

  async createOne(data: IStockDataPoint): Promise<IStockDataPoint | null> {
    try {
      const created = await UsdJpyModel.create(data);
      return created;
    } catch (error) {
      throw new Error(
        `Error UsdJpy model createOne: ${(error as Error).message}`
      );
    }
  }

  async createMany(data: IStockDataPoint[]): Promise<IStockDataPoint[] | null> {
    try {
      const inserted = await EurUsdModel.insertMany(data, { ordered: false });
      return inserted;
    } catch (error) {
      throw new Error(
        `Error UsdJpy model createMany: ${(error as Error).message}`
      );
    }
  }

  async deleteOne(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID invalido: ${id}`);
    }

    try {
      const deleted = await UsdJpyModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return deleted;
    } catch (error) {
      throw new Error(
        `Error UsdJpy model deleteOne: ${(error as Error).message}`
      );
    }
  }
}
