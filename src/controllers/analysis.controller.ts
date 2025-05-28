import { Request, Response, NextFunction } from 'express';
import EurUsdService from '../models/eurUsd.model.js';
import UsdJpyService from '../models/usdJpy.model.js';
import GbpUsdService from '../models/gbpUsd.model.js';
import AnalysisService from '../services/analysis.service.js';
import ApiError from '../errors/apiError.js';
import type { IStockDataPoint } from '../types/types.js';

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
      const dataPoints: IStockDataPoint[] =
        await service.getRecentData(parsedWindowSize);

      if (dataPoints.length < parsedWindowSize) {
        console.warn(
          `No hay suficientes datos para windowSize=${parsedWindowSize}. Se usaron ${dataPoints.length} datos.`
        );
        // Puedes decidir lanzar un error 404 aquí si la cantidad de datos es crítica
        if (dataPoints.length < 2) {
          // Asegurarse de tener el mínimo para el cálculo
          throw new ApiError(
            'No hay suficientes datos históricos para realizar la regresión lineal con la ventana especificada.',
            404
          );
        }
      }

      // Llama a la función de regresión lineal desde el AnalysisService
      const regressionResult =
        AnalysisService.calculateLinearRegression(dataPoints);

      return res.json({
        symbol: symbol,
        windowSize: parsedWindowSize,
        ...regressionResult, // slope, intercept, rSquared
      });
    } catch (error) {
      // Si calculateLinearRegression lanza un error (ej. por datos insuficientes), será capturado aquí
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

  // Aquí agregarás los controladores para los demás métodos numéricos
}

export default new AnalysisController();
