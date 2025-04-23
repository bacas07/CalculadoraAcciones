import { RequestHandler, NextFunction, Request, Response } from 'express';
import ForexRequestService from '../models/forexRequest.model.js';

export const findAllForexRequest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await ForexRequestService.findAll();

    if (!requests) {
      res.status(200).json({ message: 'No forex request found' });
      return;
    }

    res.status(200).json({
      message: `${requests.length} forex request founds`,
      requests: requests,
    });
  } catch (error) {
    console.error('Error forexRequestController findAll ', error);
    res.status(500).json({ error: 'Error finding all forex request' });
  }
};

export const findByIDForexRequest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await ForexRequestService.findByID(id);

    if (!request) {
      res.status(404).json({ error: `No request forex found with id: ${id}` });
      return;
    }

    res.status(200).json({
      message: `forex request found with id: ${id}`,
      request: request,
    });
  } catch (error) {
    console.error('Error forexRequestController findByID: ', error);
    res.status(500).json({ error: 'Error finding forex request by id' });
  }
};

export const createForexRequest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newRequest = await ForexRequestService.create(req.body);
    res.status(201).json({
      message: 'New forex request created sucessfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error forexRequestController create: ', error);
    res.status(500).json({ error: 'Error creating forex request' });
  }
};

export const deleteForexRequest: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleteRequest = await ForexRequestService.delete(id);

    if (!deleteRequest) {
      res.status(404).json({ error: `No request forex found with id: ${id}` });
      return;
    }

    res.status(200).json({
      message: 'Forex request deleted sucessfully',
      request: deleteRequest,
    });
  } catch (error) {
    console.error('Error forexRequestController delete: ', error);
    res.status(500).json({ error: 'Error deleting forex request' });
  }
};
