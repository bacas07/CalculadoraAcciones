import { Schema, model } from 'mongoose';
import type { IStockDataPointMongoose } from '../types/types.js';

const StockDataSchema = new Schema<IStockDataPointMongoose>({
  date: {
    type: String,
    required: true,
  },
  open: {
    type: Number,
    required: true,
  },
  high: {
    type: Number,
    required: true,
  },
  low: {
    type: Number,
    required: true,
  },
  close: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
});

export const ForexResponseModel = model<IStockDataPointMongoose>(
  'StockData',
  StockDataSchema
);
