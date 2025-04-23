import express, { Request, Response } from 'express';
import { connectDB } from './database/mongo.js';
import requestRouter from './routes/forexRequest.routes.js';
import responseRouter from './routes/forexResponse.route.js';

const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());

server.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Forex Predict' });
});

server.use('/forex-request', requestRouter);
server.use('/forex-response', responseRouter);

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

startingServer();
