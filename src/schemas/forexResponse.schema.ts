import { Schema, model } from 'mongoose';
import { ForexResponse } from '../types/types.js';

const DataPointSchema = new Schema({
  timestamp: {
    type: String,
    required: true,
  },
  value: { type: Number },
});

const ForexResponseSchema = new Schema(
  {
    historical: {
      type: [DataPointSchema],
      required: true,
    },
    predicted: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ForexResponseModel = model<ForexResponse>(
  'ForexRequest',
  ForexResponseSchema
);
