import { StockDataModel } from '../schemas/stockData.schema.js';
import type { IStockDataPoint } from '../types/types.js';

export class StockDataService {
  async findAll() {
    try {
      return await StockDataModel.find();
    } catch (error) {
      return console.error('Error StockDataModel findAll: ', error);
    }
  }
}
