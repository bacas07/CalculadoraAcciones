import { IStockDataPoint } from '../types/types.js';

export const parseStockData = (apiData: any): IStockDataPoint[] => {
  const rawTimeSeries = apiData['Time Series (Daily)'];

  if (!rawTimeSeries) throw new Error('No time Series data found');

  const parsed: IStockDataPoint[] = Object.entries(rawTimeSeries).map(
    ([date, data]: [string, any]) => ({
      date,
      open: parseFloat(data['1. open']),
      high: parseFloat(data['2. high']),
      low: parseFloat(data['3. low']),
      close: parseFloat(data['4. close']),
      volume: parseFloat(data['5. volume']),
    })
  );
  return parsed.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
