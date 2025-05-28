import * as math from 'mathjs';
import type { IStockDataPoint } from '../types/types.js';
import { addDays } from '../utils/dateUtils.js';

interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number; // Coeficiente de determinacion
}

interface LagrangeResult {
  interpolatedValue: number | null;
  errorMessage?: string;
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
    const xMinusMean: number[] = xValues.map((x) => x - xMean);
    const yMinusMean: number[] = yValues.map((y) => y - yMean);

    // Calcular numerador y denominador para la pendiente (m)
    // Multiplicación elemento a elemento
    const xyMinusMeansProduct: number[] = xMinusMean.map(
      (val, i) => val * yMinusMean[i]
    );

    const numerator = math.sum(xyMinusMeansProduct) as number;

    // Cuadrado elemento a elemento
    const xMinusMeanSquared: number[] = xMinusMean.map((x) => x * x);

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

    const rSquared = ssTotal === 0 ? 1 : 1 - ssResidual / ssTotal;

    /*
      slope: representa la tendencia de los datos, en caso de ser negativo significa
      que el precio tiende a disminuir con el tiempo

      intercept: es el valor de y cuando x es 0, es el valor de cierre inicial

      rSquared: explica que tan predecible o acertada es la prediccion mediante la 
      regresion lineal, que tan bien se puede explicar la tendencia mediante la
      regresion lineal. Digamos que tiene un porcentaje que se debe a la aleatoridad
      del mercado, lo cual lo hace impredecible en cierto porcentaje.
    */

    return { slope, intercept, rSquared };
  }

  // Funcion para interpolar y normalizar datos faltantes
  public interpolateMissingData(
    dataPoints: IStockDataPoint[]
  ): IStockDataPoint[] {
    if (dataPoints.length < 2) {
      // No se puede interpolar con menos de 2 puntos, devuelve una copia.
      return [...dataPoints];
    }

    const interpolatedData: IStockDataPoint[] = [];
    interpolatedData.push(dataPoints[0]); // Añade el primer punto original

    for (let i = 0; i < dataPoints.length - 1; i++) {
      const currentPoint = dataPoints[i];
      const nextPoint = dataPoints[i + 1];

      const currentDate = new Date(currentPoint.date);
      const nextDate = new Date(nextPoint.date);

      // Calcula la diferencia en días. Math.ceil es importante para capturar gaps parciales o exactos.
      // Si diffDays es 1, significa que son días consecutivos (ej. 2025-05-01 y 2025-05-02).
      // Si diffDays es > 1, hay días faltantes.
      const diffTime = Math.abs(nextDate.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Hay un gap de más de un día
        const numMissingDays = diffDays - 1;

        for (let j = 1; j <= numMissingDays; j++) {
          const missingDateStr = addDays(currentPoint.date, j);
          // Interpolación lineal del precio de cierre
          const interpolatedClose =
            currentPoint.close +
            (nextPoint.close - currentPoint.close) * (j / diffDays);

          const interpolatedPoint: IStockDataPoint = {
            date: missingDateStr,
            open: interpolatedClose, // Usar el valor interpolado para open, high, low
            high: interpolatedClose,
            low: interpolatedClose,
            close: interpolatedClose,
            // Si tu IStockDataPoint tiene 'volume', decide cómo manejarlo.
            // Para simplificar, puedes dejarlo como 0 o interpolarlo si tiene sentido.
            // volume: 0,
            // __v: 0 // Si tu modelo requiere __v, asegúrate de añadirlo o quitarlo del tipo si no es necesario.
          };
          interpolatedData.push(interpolatedPoint);
        }
      }
      interpolatedData.push(nextPoint); // Añade el siguiente punto original
    }
    return interpolatedData;
  }

  public lagrangeInterpolate(
    xValues: number[],
    yValues: number[],
    xTarget: number
  ): LagrangeResult {
    const n = xValues.length;

    if (n !== yValues.length) {
      return {
        interpolatedValue: null,
        errorMessage: 'Las longitudes de xValues y yValues deben ser iguales.',
      };
    }
    if (n === 0) {
      return {
        interpolatedValue: null,
        errorMessage: 'No se pueden interpolar puntos sin datos.',
      };
    }
    if (n === 1) {
      // Si solo hay un punto, el valor interpolado es ese y.
      return { interpolatedValue: yValues[0] };
    }

    let interpolatedValue = 0;

    for (let j = 0; j < n; j++) {
      let basisPolynomial = 1;
      for (let m = 0; m < n; m++) {
        if (m !== j) {
          // Evitar división por cero si hay xValues duplicados (lo cual no debería ocurrir con índices de tiempo)
          if (xValues[j] - xValues[m] === 0) {
            return {
              interpolatedValue: null,
              errorMessage:
                'Error: Los valores de x deben ser únicos para la interpolación de Lagrange.',
            };
          }
          basisPolynomial *= (xTarget - xValues[m]) / (xValues[j] - xValues[m]);
        }
      }
      interpolatedValue += yValues[j] * basisPolynomial;
    }

    return { interpolatedValue: interpolatedValue };
  }
}

export default new AnalysisService();
