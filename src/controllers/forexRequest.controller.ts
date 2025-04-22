import { Request, Response } from 'express';
import ForexRequestService from '../models/forexRequest.model.js';

export const findAllForexRequest = async (req: Request, res: Response) => {
  try {
    const requests = await ForexRequestService;
  } catch (error) {
    console.error('Error forexRequestController findAll');
    return res.status(500).json({ error: 'Error creating forex request' });
  }
};
