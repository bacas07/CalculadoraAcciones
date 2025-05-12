import ApiError from '../errors/apiError.js';
import { IStockDataPoint } from '../types/types.js';

type RawSeries = Record<
  string,
  Record<'1. open' | '2. high' | '3. low' | '4. close', string>
>;

export const parseStockData = (apiData: any): IStockDataPoint[] => {
  const rawSeries = apiData['Time Series FX (Daily)'] as RawSeries | undefined;
  if (!rawSeries) {
    throw new ApiError(
      'No se encontró Time Series (Daily) en la respuesta',
      502
    );
  }

  const parsed = Object.entries(rawSeries).map(([date, fields]) => {
    const openStr = fields['1. open'];
    const highStr = fields['2. high'];
    const lowStr = fields['3. low'];
    const closeStr = fields['4. close'];

    if ([openStr, highStr, lowStr, closeStr].some((v) => v == null)) {
      throw new ApiError(`Faltan precios en la fecha ${date}`, 502, fields);
    }

    const point: IStockDataPoint = {
      date,
      open: parseFloat(openStr),
      high: parseFloat(highStr),
      low: parseFloat(lowStr),
      close: parseFloat(closeStr),
    };

    if (
      [point.open, point.high, point.low, point.close].some((n) => isNaN(n))
    ) {
      throw new ApiError(`Valor numérico inválido en ${date}`, 502, point);
    }

    return point;
  });

  return parsed.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const parseSingleStock = (apiData: {
  date: string;
  data: Record<string, string>;
}): IStockDataPoint => {
  const { date, data } = apiData;
  const openStr = data['1. open'];
  const highStr = data['2. high'];
  const lowStr = data['3. low'];
  const closeStr = data['4. close'];

  if ([openStr, highStr, lowStr, closeStr].some((v) => v == null)) {
    throw new ApiError(
      `Faltan campos de precio para la fecha ${date}`,
      502,
      data
    );
  }

  const point: IStockDataPoint = {
    date,
    open: parseFloat(openStr),
    high: parseFloat(highStr),
    low: parseFloat(lowStr),
    close: parseFloat(closeStr),
  };

  if ([point.open, point.high, point.low, point.close].some((n) => isNaN(n))) {
    throw new ApiError(
      `Datos numéricos inválidos para la fecha ${date}`,
      502,
      point
    );
  }

  return point;
};
