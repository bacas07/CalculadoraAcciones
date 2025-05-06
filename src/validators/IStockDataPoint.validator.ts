import { object, string, number } from 'valibot';

export const stockDataPointSchemaValibot = object({
  date: string(),
  open: number(),
  high: number(),
  low: number(),
  close: number(),
  volume: number(),
});