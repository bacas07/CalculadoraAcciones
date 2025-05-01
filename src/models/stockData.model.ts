import { StockDataModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';

export class StockDataService {
  async getAll(): Promise<IStockDataPoint[] | null> {
    try {
      return await StockDataModel.find();
    } catch (error) {
      console.error('Error StockDataModel findAll: ', error);
      throw new Error('Error StockDataModel findAll');
    }
  }

  async getOneByID(id: string): Promise<IStockDataPoint | null> {
    try {
      return await StockDataModel.findById(id);
    } catch (error) {
      console.error('Error StockDataModel getOne: ', error);
      throw new Error('Error StockDataModel getOne');
    }
  }

  async create(data: IStockDataPoint): Promise<IStockDataPoint | null> {
    try {
      const stockCreated = await StockDataModel.create(data);
      return stockCreated;
    } catch (error) {
      console.error('Error StockDataModel create: ', error);
      throw new Error('Error StockDataModel create');
    }
  }

  async delete(id: string): Promise<any | null> {
    try {
      return await StockDataModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error StockDataModel delete: ', error);
      throw new Error('Error StockDataModel delete');
    }
  }
}
