import axios from 'axios';
import { config } from 'dotenv';

config();

export const fetchHistoricalData = async () => {
  try {
    await axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      )
      .then((res) => {
        console.log('status: ', res.status, '\ndata: ', res.data);
      });
  } catch (error) {
    console.error('Error fetching historical data: ', error);
  }
};

/*export const fetchDailyData = async () => {
  try {
    
  } catch (error) {
    console.error('Error fetching daily data: ', error)
  }
};*/
