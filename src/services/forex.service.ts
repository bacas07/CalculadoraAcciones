import { mean, subtract, multiply, sum } from 'mathjs';
import { parseTimeRange, addTimeToDate } from '../utils/dateUtils';
import { ForexDataPoint, ForexRequest, ForexResponse } from '../types/types.js';

// --- Helpers internos ---
// Interpolar valores faltantes considerando el tiempo real entre puntos.
const interpolateWithTime = (
  x: number[], // Tiempo en timestamp
  y: (number | null)[], // Valor o null en caso de que no exista
  originalData: ForexDataPoint[] // Datos originales
): ForexDataPoint[] => {
  return originalData.map((point, i) => {
    if (point.value !== null) return point;

    // Busca en el punto anterior y en el siguiente conocido
    var prevIdx = i - 1;
    while (prevIdx >= 0 && y[prevIdx] === null) prevIdx--;
    var nextIdx = i + 1;
    while (nextIdx < y.length && y[nextIdx] === null) prevIdx++;

    if (prevIdx < 0 || nextIdx >= y.length) {
      const avg = mean(y.filter((val) => val !== null) as number[]);
      return { timestamp: point.timestamp, value: avg };
    }

    // Interpolacion lineal con el tiempo
    const x0 = x[prevIdx];
    const x1 = x[nextIdx];
    const y0 = y[prevIdx] as number;
    const y1 = y[nextIdx] as number;
    const xi = x[i];
    const interpolatedValue = y0 + ((y1 - y0) * (x1 - x0)) / (x1 - x0);

    return { timestamp: point.timestamp, value: interpolatedValue };
  });
};

// Generar predicciones futuras
const generatePredictions = (
  regression: { slope: number; intercept: number },
  lastDate: Date,
  timeRangeMs: number,
  timeRange: string
): ForexDataPoint[] => {
  // En caso de no haber 1, se inicia con un valor por defecto
  const steps = timeRange.startsWith('1') ? 1 : 3;
  const predictions: ForexDataPoint[] = [];

  for (var i = 1; i <= steps; i++) {
    const futureDate = addTimeToDate(lastDate, (i * timeRangeMs) / steps);
    const futureX = futureDate.getTime();
    const futureY = regression.slope * futureX + regression.intercept;

    predictions.push({
      timestamp: futureDate.toISOString(),
      value: futureY,
    });
  }

  return predictions;
};
