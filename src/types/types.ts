import { Document } from 'mongoose';

export interface IForexDataPoint {
  timestamp: string; // Formato ISO: '2024-01-01-01T00:00:00Z'
  value: number | null; // Permitir null para datos faltantes
}

// Es la misma interfaz solo que con campos de mongoose integrados
export interface IForexDataPointMongoose extends Document {
  timestamp: string;
  value: number | null;
}

export interface IForexRequest {
  data: IForexDataPoint[]; // Datos para interpolar
  timeRange: string; // Tiempo estimado de prediccion
}

export interface IForexRequestMongoose extends Document {
  data: [IForexDataPointMongoose];
  timeRange: string;
  _id: string;
}

export interface IForexResponse {
  historical: IForexDataPoint[]; // Datos limpios ya interpolados
  predicted: IForexDataPoint[]; // Datos previstos en el rango de tiempo
  requestID: string;
}

export interface IForexResponseMongoose extends Document {
  historical: IForexDataPointMongoose[];
  predicted: IForexDataPointMongoose[];
  requestID: string;
}
