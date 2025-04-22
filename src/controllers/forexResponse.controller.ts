import { Request, Response } from 'express';
import ForexResponseService from '../models/forexResponse.model.js';

export const findAllForexResponse = async (req: Request, res: Response) => {
  try {
    const responses = await ForexResponseService.findAll();

    if (!responses) {
      return res.status(200).json({ message: 'No forex responses found' });
    }

    return res.status(200).json({
      message: `${responses.length} forex responses found`,
      responses: responses,
    });
  } catch (error) {
    console.error('Error forexResponseController findAll: ', error);
    return res.status(500).json({ error: 'Error finding all forex responses' });
  }
};
