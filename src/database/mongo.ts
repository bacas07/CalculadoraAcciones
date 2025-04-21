import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGO_URL = process.env.MONGO_URL || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('> Servidor conectado a la base de datos');
  } catch (error) {
    console.error('> Error al conectar servidor a la base de datos: ', error);
    process.exit(1);
  }
};
