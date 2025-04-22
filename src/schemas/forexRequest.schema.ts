import { Schema, Document, model } from 'mongoose';
import type {
  IForexDataPointMongoose,
  IForexRequestMongoose,
} from '../types/types.js';

const DataPointSchema = new Schema<IForexDataPointMongoose>({
  timestamp: {
    type: String,
    required: true,
  },
  value: { type: Number },
});

const ForexRequestSchema = new Schema<IForexRequestMongoose>(
  {
    data: {
      type: [DataPointSchema],
      required: true,
    },
    timeRange: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ForexRequestModel = model<IForexRequestMongoose>(
  'ForexRequest',
  ForexRequestSchema
);
