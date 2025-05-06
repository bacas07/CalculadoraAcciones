import { EurUsdModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';
import { Types } from 'mongoose';

export default class EurUsdService {
  private service = EurUsdModel;

  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      const result = await this.service.find();

      if (!result) throw new Error('No se encontraron registros para EurUsd');

      return result;
    } catch (error) {
      throw new Error(`Error EurUsd model getAll: ${(error as Error).message}`);
    }
  }

  async getById(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID invalido: ${id}`);
    }

    try {
      const result = await this.service.findById(id);

      if (!result) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return result;
    } catch (error) {
      throw new Error(
        `Error EurUsd model getById: ${(error as Error).message}`
      );
    }
  }

  async createOne(data: IStockDataPoint): Promise<IStockDataPoint | null> {
    try {
      const created = await this.service.create(data);
      return created;
    } catch (error) {
      throw new Error(
        `Error EurUsd model createOne: ${(error as Error).message}`
      );
    }
  }

  async createMany(data: IStockDataPoint[]): Promise<IStockDataPoint[] | null> {
    try {
      const inserted = await this.service.insertMany(data, { ordered: false });
      return inserted;
    } catch (error) {
      throw new Error(
        `Error EurUsd model createMany: ${(error as Error).message}`
      );
    }
  }

  async deleteOne(id: string): Promise<IStockDataPoint | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID invalido: ${id}`);
    }

    try {
      const deleted = await this.service.findByIdAndDelete(id);

      if (!deleted) {
        throw new Error(`No se encontraron registros para el id: ${id}`);
      }

      return deleted;
    } catch (error) {
      throw new Error(
        `Error EurUsd model deleteOne: ${(error as Error).message}`
      );
    }
  }
}
