import axios from 'axios';
import { config } from 'dotenv';
import ApiError from '../errors/apiError.js';

config();

export const fetchHistoricalData = async (
  fromSymbol: string,
  toSymbol: string
): Promise<any> => {
  try {
    const fn = 'FX_DAILY';
    const output = 'full';
    const BASE_URL = 'https://www.alphavantage.co/query?';
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    const res = await axios.get(BASE_URL, {
      params: {
        function: fn,
        from_symbol: fromSymbol.toUpperCase(),
        to_symbol: toSymbol.toUpperCase(),
        outputsize: output,
        apikey: API_KEY,
      },
    });

    if (!res)
      throw new ApiError('No se obtuvo respuesta de Alpha vintage', 502);

    return res.data;
  } catch (error) {
    throw new Error(`Respuesta inesperada de Alpha vantage: ${error}`);
  }
};

type TimeSeries = Record<string, Record<string, string>>;

const getLastTradingDate = (series: TimeSeries): string => {
  const dates = Object.keys(series).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (dates.length === 0) {
    throw new ApiError('No hay fechas disponibles en el Time Series', 404);
  }

  return dates[0];
};

export const fetchPreviousDayData = async (
  fromSymbol: string,
  toSymbol: string
): Promise<{ date: string; data: Record<string, string> }> => {
  // 1) Llamada genérica: función FX_DAILY y tamaño compact
  const response = await axios.get('https://www.alphavantage.co/query?', {
    params: {
      function: 'FX_DAILY',
      from_symbol: fromSymbol.toUpperCase(),
      to_symbol: toSymbol.toUpperCase(),
      outputsize: 'compact',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  // 2) Usamos la clave correcta y comprobamos
  const series = (response.data as any)['Time Series FX (Daily)'] as TimeSeries;
  if (!series) {
    const note =
      (response.data as any)['Note'] ||
      (response.data as any)['Error Message'] ||
      'Time Series FX (Daily) ausente';
    throw new ApiError(`Alpha Vantage error: ${note}`, 502, response.data);
  }

  // 3) En vez de suponer “ayer”, tomamos la última fecha disponible
  const lastDate = getLastTradingDate(series);
  const data = series[lastDate];

  // 4) Validamos que haya datos en esa fecha
  if (!data) {
    throw new ApiError(`No hay datos para la fecha ${lastDate}`, 404);
  }

  // 5) Devolvemos fecha + registro completo
  return { date: lastDate, data };
};
