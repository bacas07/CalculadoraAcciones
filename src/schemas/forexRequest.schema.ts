import { Schema, model } from 'mongoose';
import { ForexRequest } from '../types/types.js';

const DataPointSchema = new Schema({
  timestamp: {
    type: String,
    required: true,
  },
  value: { type: Number },
});

const ForexRequestSchema = new Schema(
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

export const ForexRequestModel = model<ForexRequest>(
  'ForexRequest',
  ForexRequestSchema
);
