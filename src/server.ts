import express, { Request, Response } from 'express';
import { connectDB } from './database/mongo.js';
import requestRouter from './routes/forexRequest.routes.js';
import responseRouter from './routes/forexResponse.routes.js';
import EurUsdRouter from './routes/eurUsd.routes.js';
import GbpUsdRouter from './routes/gbpUsd.routes.js';
import UsdJpyRouter from './routes/UsdJpy.routes.js';

// Error handler
import { errorHandler } from './middlewares/custom/errorHandler.js';

// Middlewares externos
import cors from './middlewares/external/cors.js';
import helmet from './middlewares/external/helmet.js';
import morgan from './middlewares/external/morgan.js';

// Testing new features
import {
  fetchHistoricalData,
  fetchPreviousDayData,
} from './services/fetchingData.service.js';
import {
  parseStockData,
  parseSingleStock,
} from './services/parseStockData.service.js';

const PORT = process.env.PORT || 5000;
const server = express();

// Lectuta de json para nuestra aplicacion
server.use(express.json());

// Implementacion de middlewares
server.use(cors);
server.use(helmet);
server.use(morgan);

server.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Forex Predict' });
});

// Rutas antiguas sin funcionalidad en el nuevo codigo
server.use('/forex-request', requestRouter);
server.use('/forex-response', responseRouter);

// Rutas nuevas para predicciones reales
server.use('/eurusd', EurUsdRouter);
server.use('/gbpusd', GbpUsdRouter);
server.use('/usdjpy', UsdJpyRouter);

server.use(errorHandler);

const startingServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`> Servidor activo en el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error('> Error activando el servidor: ', error);
    process.exit(1);
  }
};

// funcion principal para obtener el historico de datos completos
const parsing = async () => {
  const data = await fetchHistoricalData();

  if (!data?.['Time Series (Daily)']) {
    console.warn('Formato de respuesta inesperado: ', data);
    return;
  }

  const points = parseStockData(data);
  console.log(points);
};

// parsing();

// Funcion para obtener el valor del dia anterior
const parsingLatest = async () => {
  const data = await fetchPreviousDayData();

  if (!data) {
    console.warn('No se encontro informacion para el dia anterior: ', data);
    return;
  }

  const point = parseSingleStock(data);
  console.log(point);
};

// parsingLatest();

startingServer();
