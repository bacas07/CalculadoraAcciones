import { Schema, model } from 'mongoose';
import type {
  IForexDataPointMongoose,
  IForexResponseMongoose,
} from '../types/types.js';

const DataPointSchema = new Schema<IForexDataPointMongoose>({
  timestamp: {
    type: String,
    required: true,
  },
  value: { type: Number },
});

const ForexResponseSchema = new Schema<IForexResponseMongoose>(
  {
    historical: {
      type: [DataPointSchema],
      required: true,
    },
    predicted: {
      type: [DataPointSchema],
      required: true,
    },
    requestID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ForexResponseModel = model<IForexResponseMongoose>(
  'ForexResponse',
  ForexResponseSchema
);
