export interface ForexDataPoint {
  timestamp: string; // Formato ISO: '2024-01-01-01T00:00:00Z'
  value: number | null; // Permitir null para datos faltantes
}

export interface ForexRequest {
  data: ForexDataPoint[]; // Datos para interpolar
  timeRange: string; // Tiempo estimado de prediccion
}

export interface ForexResponse {
  historical: ForexDataPoint[]; // Datos limpios ya interpolados
  predicted: ForexDataPoint[]; // Datos previstos en el rango de tiempo
  requestID: string;
}
