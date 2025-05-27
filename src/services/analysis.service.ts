// src/services/analysis.service.ts

import * as math from 'mathjs'; // Importa todo el objeto mathjs
import type { IStockDataPoint } from '../types/types.js';

interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number; // Coeficiente de determinacion
}

class AnalysisService {
  public calculateLinearRegression(
    dataPoints: IStockDataPoint[]
  ): LinearRegressionResult {
    if (dataPoints.length < 2) {
      throw new Error(
        'Se necesitan al menos dos puntos para hacer regresion lineal'
      );
    }

    const n = dataPoints.length;
    const xValues: number[] = [];
    const yValues: number[] = dataPoints.map((point) => point.close);

    for (let i = 0; i < n; i++) {
      xValues.push(i);
    }

    const xMean = math.mean(xValues) as number;
    const yMean = math.mean(yValues) as number;

    // Calcular las diferencias elemento a elemento usando JS nativo
    // Esto evita los problemas de tipado de mathjs con MathType vs number[] para estas ops
    const xMinusMean: number[] = xValues.map(x => x - xMean);
    const yMinusMean: number[] = yValues.map(y => y - yMean);

    // Calcular numerador y denominador para la pendiente (m)
    // Multiplicación elemento a elemento
    const xyMinusMeansProduct: number[] = xMinusMean.map((val, i) => val * yMinusMean[i]);
    
    const numerator = math.sum(xyMinusMeansProduct) as number;

    // Cuadrado elemento a elemento
    const xMinusMeanSquared: number[] = xMinusMean.map(x => x * x);
    
    const denominator = math.sum(xMinusMeanSquared) as number;

    if (denominator === 0) {
      throw new Error(
        'No se pudo calcular la pendiente: denominador es cero (todos los puntos x son iguales).'
      );
    }

    const slope = numerator / denominator;

    const intercept = yMean - slope * xMean;

    let ssTotal = 0;
    let ssResidual = 0;

    for (let i = 0; i < n; i++) {
      const yActual = yValues[i];
      const yPredicted = slope * xValues[i] + intercept;
      ssTotal += (yActual - yMean) * (yActual - yMean);
      ssResidual += (yActual - yPredicted) * (yActual - yPredicted);
    }

    const rSquared = (ssTotal === 0) ? 1 : 1 - (ssResidual / ssTotal);

    return { slope, intercept, rSquared };
  }
}

export default new AnalysisService();