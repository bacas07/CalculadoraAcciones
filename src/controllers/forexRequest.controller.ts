import { Request, Response } from 'express';
import ForexRequestService from '../models/forexRequest.model.js';

export const findAllForexRequest = async (req: Request, res: Response) => {
  try {
    const requests = await ForexRequestService.findAll();

    if (!requests) {
      return res.status(200).json({ message: 'No forex request found' });
    }

    return res.status(200).json({
      message: `${requests.length} forex request founds`,
      requests: requests,
    });
  } catch (error) {
    console.error('Error forexRequestController findAll');
    return res.status(500).json({ error: 'Error finding all forex request' });
  }
};

export const findByIDForexRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await ForexRequestService.findByID(id);

    if (!request) {
      return res
        .status(404)
        .json({ message: `No request forex found with id: ${id}` });
    }

    return res
      .status(200)
      .json({ message: `forex request foud with id: ${id}`, request: request });
  } catch (error) {
    console.error('Error forexRequestController findByID');
    return res.status(500).json({ error: 'Error finding forex request by id' });
  }
};
