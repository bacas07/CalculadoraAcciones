import { mean, subtract, multiply, sum } from 'mathjs';
import { parseTimeRange, addTimeToDate } from '../utils/dateUtils.js';
import {
  IForexDataPoint,
  IForexResponse,
  IForexRequestMongoose,
} from '../types/types.js';

// --- Helpers internos ---
// Interpolar valores faltantes considerando el tiempo real entre puntos.
const interpolateWithTime = (
  x: number[],
  y: (number | null)[],
  originalData: IForexDataPoint[]
): IForexDataPoint[] => {
  return originalData.map((point, i) => {
    if (point.value !== null) return point;

    // Busca en el punto anterior y en el siguiente conocido
    let prevIdx = i - 1;
    while (prevIdx >= 0 && y[prevIdx] === null) prevIdx--;

    let nextIdx = i + 1;
    while (nextIdx < y.length && y[nextIdx] === null) nextIdx++;

    if (prevIdx < 0 || nextIdx >= y.length) {
      const avg = mean(y.filter((val) => val !== null) as number[]);
      return { timestamp: point.timestamp, value: avg };
    }

    // Interpolación lineal con tiempo real
    const x0 = x[prevIdx];
    const x1 = x[nextIdx];
    const y0 = y[prevIdx] as number;
    const y1 = y[nextIdx] as number;
    const xi = x[i];
    const interpolatedValue = y0 + ((y1 - y0) * (xi - x0)) / (x1 - x0);

    return { timestamp: point.timestamp, value: interpolatedValue };
  });
};

const linearRegressionWithTime = (x: number[], y: IForexDataPoint[]) => {
  const yValues = y.map((d) => d.value as number);
  const xMean = mean(x);
  const yMean = mean(yValues);

  const xMinusMean = subtract(x, xMean).valueOf() as number[];
  const yMinusMean = subtract(yValues, yMean).valueOf() as number[];

  const numerator = sum(multiply(xMinusMean, yMinusMean).valueOf() as number[]);
  const denominator = sum(
    multiply(xMinusMean, xMinusMean).valueOf() as number[]
  );

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
};

// Generar predicciones futuras
const generatePredictions = (
  regression: { slope: number; intercept: number },
  lastDate: Date,
  timeRangeMs: number,
  timeRange: string
): IForexDataPoint[] => {
  const steps = timeRange.startsWith('1') ? 1 : 3;
  const predictions: IForexDataPoint[] = [];

  for (let i = 1; i <= steps; i++) {
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

// Predecir valores de futuras divisas usando datos históricos
export const predictForex = (
  request: IForexRequestMongoose
): IForexResponse => {
  const { data, timeRange, _id } = request;
  const timeRangeMs = parseTimeRange(timeRange);

  const x = data.map((d) => new Date(d.timestamp).getTime());
  const y = data.map((d) => d.value);

  const cleanData = interpolateWithTime(x, y, data);
  const regression = linearRegressionWithTime(x, cleanData);

  const lastDate = new Date(data[data.length - 1].timestamp);
  const predictedData = generatePredictions(
    regression,
    lastDate,
    timeRangeMs,
    timeRange
  );

  return {
    historical: cleanData,
    predicted: predictedData,
    requestID: _id.toString(),
  };
};
