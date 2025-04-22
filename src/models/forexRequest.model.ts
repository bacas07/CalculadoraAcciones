import { ForexRequestModel } from '../schemas/forexRequest.schema.js';
import type { IForexRequest } from '../types/types.js';

export default class ForexRequestService {
  findAll = async () => {
    try {
      return await ForexRequestModel.find();
    } catch (error) {
      return console.error('Error ForexRequestModel findAll: ', error);
    }
  };

  findByID = async (id: string) => {
    try {
      return await ForexRequestModel.findById(id);
    } catch (error) {
      return console.error('Error ForexRequestModel findByID: ', error);
    }
  };

  create = async (request: IForexRequest) => {
    try {
      const created = await ForexRequestModel.create(request);
      return created;
    } catch (error) {
      return console.error('Error ForexRequestModel create: ', error);
    }
  };

  delete = async (id: string) => {
    try {
      return await ForexRequestModel.findByIdAndDelete(id);
    } catch (error) {
      return console.error('Error ForexRequestModel delete: ', error);
    }
  };
}
