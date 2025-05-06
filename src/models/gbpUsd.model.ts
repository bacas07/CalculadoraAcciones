import { GbpUsdModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';
import { Types } from 'mongoose';

export default class GbpUsdService {
  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      const result = await GbpUsdModel.find();

      if (!result) {
        throw new Error(`No se encontraron registos para GbpUsd`);
      }

      return result;
    } catch (error) {
      throw new Error(`Error GbpUsd model getAll: ${(error as Error).message}`);
    }
  }

  async getOneById(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID invalido: ${id}`);
    }

    try {
      const result = await GbpUsdModel.findById(id);

      if (!result) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return result;
    } catch (error) {
      throw new Error(
        `Error GbpUsd model getOneByid: ${(error as Error).message}`
      );
    }
  }

  async createOne(data: IStockDataPoint): Promise<IStockDataPoint | null> {
    try {
      const created = await GbpUsdModel.create(data);
      return created;
    } catch (error) {
      throw new Error(
        `Error GbpUsd model createOne: ${(error as Error).message}`
      );
    }
  }

  async createMany(data: IStockDataPoint[]): Promise<IStockDataPoint[] | null> {
    try {
      const inserted = await GbpUsdModel.insertMany(data, { ordered: false });
      return inserted;
    } catch (error) {
      throw new Error(
        `Error GpbUsd model createMany: ${(error as Error).message}`
      );
    }
  }

  async deleteOne(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID invalido: ${id}`);
    }

    try {
      const deleted = await GbpUsdModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return deleted;
    } catch (error) {
      throw new Error(
        `Error GpbUsd model deleteOne: ${(error as Error).message}`
      );
    }
  }
}
