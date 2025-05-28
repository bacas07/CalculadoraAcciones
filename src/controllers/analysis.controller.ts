import { Request, Response, NextFunction } from 'express';
import EurUsdService from '../models/eurUsd.model.js';
import UsdJpyService from '../models/usdJpy.model.js';
import GbpUsdService from '../models/gbpUsd.model.js';
import AnalysisService from '../services/analysis.service.js';
import ApiError from '../errors/apiError.js';
import type { IStockDataPoint } from '../types/types.js';
import { addDays } from '../utils/dateUtils.js';

class AnalysisController {
  private services = {
    eurusd: EurUsdService,
    usdjpy: UsdJpyService,
    gbpusd: GbpUsdService,
  };

  async getLinearRegression(req: Request, res: Response, next: NextFunction) {
    const { symbol, windowSize } = req.params;

    if (!(symbol in this.services)) {
      return next(new ApiError(`Símbolo de divisa inválido: ${symbol}`, 400));
    }
    const parsedWindowSize = parseInt(windowSize);
    if (isNaN(parsedWindowSize) || parsedWindowSize < 2) {
      return next(
        new ApiError(
          'El tamaño de la ventana (windowSize) debe ser un número entero mayor o igual a 2.',
          400
        )
      );
    }

    try {
      const service = this.services[symbol as keyof typeof this.services];
      // 1. Obtener los datos crudos (con posibles gaps)
      const rawDataPoints: IStockDataPoint[] = await (
        service as any
      ).getRecentData(parsedWindowSize);

      // 2. Aplicar la interpolación lineal para rellenar los gaps
      const dataPoints: IStockDataPoint[] =
        AnalysisService.interpolateMissingData(rawDataPoints);

      // 3. Verificar si hay suficientes datos DESPUÉS de la interpolación
      // Puede que rawDataPoints.length sea menor que windowSize,
      // pero interpolatedData.length podría ser mayor o igual a windowSize
      // si los gaps fueron rellenados.
      if (dataPoints.length < parsedWindowSize) {
        console.warn(
          `No hay suficientes datos para windowSize=${parsedWindowSize} (después de interpolar). Se usaron ${dataPoints.length} datos.`
        );
        // Si incluso después de interpolar no hay suficientes puntos para la ventana,
        // o si los puntos interpolados siguen siendo < 2 (mínimo para regresión), lanza un error.
        if (dataPoints.length < 2) {
          throw new ApiError(
            'No hay suficientes datos históricos (o el período es muy corto) para realizar la regresión lineal.',
            404
          );
        }
      }

      const regressionResult =
        AnalysisService.calculateLinearRegression(dataPoints);

      return res.json({
        symbol: symbol,
        windowSize: parsedWindowSize,
        ...regressionResult,
        rawDataCount: rawDataPoints.length, // Para ver cuántos datos originales había
        interpolatedDataCount: dataPoints.length, // Para ver cuántos datos se usaron después de interpolar
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(
          new ApiError(
            `Error al calcular regresión lineal: ${error.message}`,
            500
          )
        );
      }
      next(error);
    }
  }

  async getInterpolatedLinearData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { symbol, windowSize } = req.params;

    if (!(symbol in this.services)) {
      return next(new ApiError(`Símbolo de divisa inválido: ${symbol}`, 400));
    }
    const parsedWindowSize = parseInt(windowSize);
    if (isNaN(parsedWindowSize) || parsedWindowSize < 2) {
      return next(
        new ApiError(
          'El tamaño de la ventana (windowSize) debe ser un número entero mayor o igual a 2.',
          400
        )
      );
    }

    try {
      const service = this.services[symbol as keyof typeof this.services];
      // Obtener los datos crudos (con posibles gaps)
      const rawDataPoints: IStockDataPoint[] = await (
        service as any
      ).getRecentData(parsedWindowSize);

      // Aplicar la interpolación lineal
      const interpolatedData: IStockDataPoint[] =
        AnalysisService.interpolateMissingData(rawDataPoints);

      return res.json({
        symbol: symbol,
        windowSize: parsedWindowSize,
        rawDataCount: rawDataPoints.length,
        interpolatedDataCount: interpolatedData.length,
        // Devolver solo la fecha y el cierre para no saturar la respuesta,
        // o todos los campos si es necesario.
        interpolatedData: interpolatedData.map((d) => ({
          date: d.date,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          // Añade otras propiedades si las tienes y quieres verlas
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(
          new ApiError(
            `Error al obtener datos interpolados: ${error.message}`,
            500
          )
        );
      }
      next(error);
    }
  }

  async getLagrangeInterpolation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { symbol, windowSize, xTarget } = req.params;

    if (!(symbol in this.services)) {
      return next(new ApiError(`Símbolo de divisa inválido: ${symbol}`, 400));
    }
    const parsedWindowSize = parseInt(windowSize);
    const parsedXTarget = parseFloat(xTarget); // Puede ser decimal

    if (
      isNaN(parsedWindowSize) ||
      parsedWindowSize < 2 ||
      isNaN(parsedXTarget)
    ) {
      return next(
        new ApiError(
          'Parámetros inválidos. windowSize debe ser >= 2 y xTarget debe ser un número.',
          400
        )
      );
    }

    try {
      const service = this.services[symbol as keyof typeof this.services];
      // 1. Obtener datos históricos crudos
      const rawDataPoints: IStockDataPoint[] = await (
        service as any
      ).getRecentData(parsedWindowSize);

      // 2. Interpolar linealmente los datos para asegurar que los 'x' (índices de tiempo) sean consecutivos.
      // Esto es clave para que Lagrange funcione bien, ya que necesita puntos bien definidos.
      const dataPoints: IStockDataPoint[] =
        AnalysisService.interpolateMissingData(rawDataPoints);

      if (dataPoints.length < 2) {
        throw new ApiError(
          'No hay suficientes datos históricos (o el período es muy corto) para realizar la interpolación de Lagrange.',
          404
        );
      }

      // 3. Preparar xValues (índices) e yValues (precios de cierre) para Lagrange
      const xValues: number[] = Array.from(
        { length: dataPoints.length },
        (_, i) => i
      ); // 0, 1, 2, ..., n-1
      const yValues: number[] = dataPoints.map((p) => p.close);

      // 4. Realizar la interpolación de Lagrange
      const lagrangeResult = AnalysisService.lagrangeInterpolate(
        xValues,
        yValues,
        parsedXTarget
      );

      if (lagrangeResult.errorMessage) {
        return next(
          new ApiError(
            `Error en la interpolación de Lagrange: ${lagrangeResult.errorMessage}`,
            500
          )
        );
      }

      // 5. Opcional: Convertir el xTarget a una fecha aproximada para mejor comprensión
      const baseDate = new Date(dataPoints[0].date); // Fecha del primer punto de datos (índice 0)
      const predictedDate = addDays(
        dataPoints[0].date,
        Math.round(parsedXTarget)
      ); // Redondeamos xTarget para la fecha

      return res.json({
        symbol: symbol,
        windowSize: parsedWindowSize,
        xTarget: parsedXTarget,
        predictedDate: predictedDate, // Fecha aproximada del punto interpolado
        interpolatedValue: lagrangeResult.interpolatedValue, // El precio interpolado
        baseDateForXIndices: dataPoints[0].date, // La fecha que corresponde al índice 0
        rawDataCount: rawDataPoints.length,
        interpolatedDataCount: dataPoints.length,
        // Puedes incluir los puntos usados para la interpolación si es útil para depuración:
        // pointsUsedForLagrange: dataPoints.map((d, i) => ({ x: i, y: d.close, date: d.date }))
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(
          new ApiError(
            `Error al realizar la interpolación de Lagrange: ${error.message}`,
            500
          )
        );
      }
      next(error);
    }
  }

  async getTrapezoidalIntegral(req: Request, res: Response, next: NextFunction) {
    const { symbol, windowSize, lowerBound, upperBound, numSegments } = req.params;

    if (!(symbol in this.services)) {
      return next(new ApiError(`Símbolo de divisa inválido: ${symbol}`, 400));
    }

    const parsedWindowSize = parseInt(windowSize);
    const parsedLowerBound = parseFloat(lowerBound); // Puede ser decimal
    const parsedUpperBound = parseFloat(upperBound); // Puede ser decimal
    const parsedNumSegments = numSegments ? parseInt(numSegments) : 100; // Default a 100

    if (isNaN(parsedWindowSize) || parsedWindowSize < 2 ||
        isNaN(parsedLowerBound) || isNaN(parsedUpperBound) || parsedLowerBound >= parsedUpperBound ||
        isNaN(parsedNumSegments) || parsedNumSegments <= 0) {
      return next(new ApiError(
        'Parámetros inválidos. windowSize debe ser >= 2, lowerBound < upperBound, y numSegments > 0.',
        400
      ));
    }

    try {
      const service = this.services[symbol as keyof typeof this.services];
      // 1. Obtener datos históricos crudos
      const rawDataPoints: IStockDataPoint[] = await (service as any).getRecentData(parsedWindowSize);

      // 2. Interpolar linealmente los datos para asegurar continuidad
      const dataPoints: IStockDataPoint[] = AnalysisService.interpolateMissingData(rawDataPoints);

      if (dataPoints.length < 2) {
        throw new ApiError("No hay suficientes datos históricos para calcular la regresión lineal para la integral.", 404);
      }

      // 3. Calcular la regresión lineal para obtener la función f(x) = slope * x + intercept
      const { slope, intercept } = AnalysisService.calculateLinearRegression(dataPoints);

      // 4. Usar la función de integración por trapecios
      const integralResult = AnalysisService.integrateTrapezoidal(
        slope,
        intercept,
        parsedLowerBound,
        parsedUpperBound,
        parsedNumSegments
      );

      if (integralResult.errorMessage) {
        return next(new ApiError(
          `Error en el cálculo de la integral por trapecios: ${integralResult.errorMessage}`,
          500
        ));
      }

      // Opcional: Calcular las fechas correspondientes a los límites
      const baseDate = dataPoints[0].date;
      const lowerDate = addDays(baseDate, Math.round(parsedLowerBound));
      const upperDate = addDays(baseDate, Math.round(parsedUpperBound));


      return res.json({
        symbol: symbol,
        windowSize: parsedWindowSize,
        lowerBound: parsedLowerBound,
        upperBound: parsedUpperBound,
        lowerDate: lowerDate, // Fecha del límite inferior
        upperDate: upperDate, // Fecha del límite superior
        numSegments: parsedNumSegments,
        slopeUsed: slope, // Pendiente de la línea de tendencia utilizada
        interceptUsed: intercept, // Intercepto de la línea de tendencia utilizada
        integratedArea: integralResult.area, // El área bajo la curva
        rawDataCount: rawDataPoints.length,
        interpolatedDataCount: dataPoints.length,
      });

    } catch (error) {
      if (error instanceof Error) {
        return next(new ApiError(`Error al calcular la integral por trapecios: ${error.message}`, 500));
      }
      next(error);
    }
  }
}

export default new AnalysisController();
