import { Request, Response } from 'express';
import ForexResponseService from '../models/forexResponse.model.js';
import ForexRequestService from '../models/forexRequest.model.js';
import { predictForex } from '../services/forex.service.js';

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
        .json({ error: `No forex response found with id: ${id}` });
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
        .json({ error: `No forext responses found with Request id: ${id}` });
    }

    return res.status(200).json({
      message: `${responses.length} forex responses found with request id: ${id}`,
      responses: responses,
    });
  } catch (error) {
    console.error('Error forexResponseController findByRequestID: ', error);
    return res
      .status(500)
      .json({ error: 'Error finding responses whith request id' });
  }
};

export const createForexResponse = async (req: Request, res: Response) => {
  try {
    const requestID = req.params.requestID;
    const foundRequest = await ForexRequestService.findByID(requestID);

    if (!foundRequest) {
      return res
        .status(404)
        .json({ error: `No request found with id: ${requestID}` });
    }

    const prediction = predictForex(foundRequest);

    const response = ForexResponseService.create(prediction);
    return res.status(201).json({
      message: `New forex response created sucessfully`,
      response: response,
    });
  } catch (error) {
    console.error('Error forexResponseController crate: ', error);
    return res.status(500).json({ error: 'Error creating forex response' });
  }
};

export const deleteForexResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteResponse = await ForexResponseService.delete(id);

    if (!deleteResponse) {
      return res
        .status(404)
        .json({ error: `No response forex found with id: ${id}` });
    }

    return res.status(204).json({
      message: 'Forex response deleted sucessfully',
      response: deleteResponse,
    });
  } catch (error) {
    console.error('Error forexResponseController delete: ', error);
    return res.status(500).json({ error: 'Error deleting forex response' });
  }
};
