import axios from 'axios';
import { config } from 'dotenv';

config();

export const fetchHistoricalData = async (): Promise<any> => {
  try {
    const res = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    return res.data;
  } catch (error) {
    console.error('Error  fetching historical data: ', error);
    throw error;
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
      data: previousDayData
    }
  } catch (error) {
    console.error('Error fetching previous day data: ', error);
    throw error;
  }
};
