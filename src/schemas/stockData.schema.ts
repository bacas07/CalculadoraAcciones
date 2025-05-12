import { Schema, model } from 'mongoose';
import type {
  IStockDataPointMongoose,
  IStockDataPoint,
} from '../types/types.js';

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
  }
});

export const EurUsdModel = model<IStockDataPoint>('EurUsd', StockDataSchema, 'EurUsd');

export const UsdJpyModel = model<IStockDataPoint>('UsdJpy', StockDataSchema, 'UsdJpy');

export const GbpUsdModel = model<IStockDataPoint>('BgpUsd', StockDataSchema, 'GbpUsd');
