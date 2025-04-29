import get from 'axios';
import { config } from 'dotenv';

config();

export const fetchHistoricalData = async (): Promise<any> => {
  try {
    const res = await get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    console.log('status: ', res.status, '\ndata: ', res.data);
    return res.data;
  } catch (error) {
    console.error('Error  fetching historical data: ', error);
    throw error;
  }
};

/*export const fetchDailyData = async () => {
  try {
    
  } catch (error) {
    console.error('Error fetching daily data: ', error)
  }
};*/
