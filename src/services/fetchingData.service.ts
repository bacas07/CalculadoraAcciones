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

    if(!res) throw new ApiError('No se obtuvo respuesta de Alpha vintage', 502)
    

    return res.data;
  } catch (error) {
    throw new ApiError('Respuesta inesperada de Alpha vantage', 502)
  }
};

export const fetchPreviousDayData = async (): Promise<any> => {
  try {
    const res = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const timeSeries = res.data['Time Series (Daily)'];

    if (!timeSeries) {
      throw new Error('Time series not found in response');
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    const formatedDate = `${year}-${month}-${day}`;

    const previousDayData = timeSeries[formatedDate];

    if (!formatedDate) {
      throw new Error(`No data found for ${formatedDate}`);
    }

    return {
      date: formatedDate,
      data: previousDayData,
    };
  } catch (error) {
    console.error('Error fetching previous day data: ', error);
    throw error;
  }
};
