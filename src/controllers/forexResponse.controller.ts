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

export const findByIDForexResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await ForexResponseService.findByID(id);

    if (!response) {
      return res
        .status(404)
        .json({ message: `No forex response found with id: ${id}` });
    }

    return res.status(200).json({
      message: `forex response found with id: ${id}`,
      response: response,
    });
  } catch (error) {
    console.error('Error forexResponseController findByID: ', error);
    return res.status(500).json({ error: 'Error findind response with id' });
  }
};

export const findByRequestIDForexResponse = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const responses = await ForexResponseService.findByRequestID(id);

    if (!responses) {
      return res
        .status(404)
        .json({ message: `No forext responses found with Request id: ${id}` });
    }

    return res.status(200).json({
      message: `${responses.length} forex responses found with request id: ${id}`,
      responses: responses,
    });
  } catch (error) {
    console.error('Error forexResponseController findByRequestID: ', error);
    return res.status(500);
  }
};
