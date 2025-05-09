import type { ErrorRequestHandler } from 'express';
import ApiError from '../../errors/apiErros';

export const errorHandler: ErrorRequestHandler = (error, _, res, next) => {
  console.error(error);

  // Manejo de errores generales
  if (error instanceof ApiError) {
    const responseBody: Record<string, any> = {
      error: error.message,
    };
    if (error.details) {
      responseBody.details = error.details;
    }

    res.status(error.statusCode).json(responseBody);
    return;
  }

  // Manejo de errores de validacion de mongoose
  if (
    error &&
    typeof error === 'object' &&
    (error as any).name === 'ValidationError'
  ) {
    res.status(400).json({
      error: 'Error de validacion en base de datos',
      details: (error as any).message,
    });
    return;
  }

  // Fallback generico
  res.status(500).json({ error: 'Error interno del servidor' });
  return;
};
