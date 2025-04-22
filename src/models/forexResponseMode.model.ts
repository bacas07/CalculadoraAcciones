import { ForexResponseModel } from '../schemas/forexResponse.schema.js';
import type { ForexResponse } from '../types/types.js';

export default class ForexResponseServive {
  findAll = async () => {
    try {
      return await ForexResponseModel.find();
    } catch (error) {
      return console.error('Error ForexResponseModel findAll: ', error);
    }
  };

  findByID = async (id: string) => {
    try {
      return ForexResponseModel.findById(id);
    } catch (error) {
      return console.error('Error ForexResponseModel findByID: ', error);
    }
  };

  findByRequestID = async (requestID: string) => {
    try {
      return ForexResponseModel.find({ requestID });
    } catch (error) {
      return console.error('Error ForexResponseModel findByRequestID: ', error);
    }
  };

  create = async (response: ForexResponse) => {
    try {
      const created = await ForexResponseModel.create(response);
      return created;
    } catch (error) {
      return console.error('Error ForexResponseModel create: ', error);
    }
  };
}
