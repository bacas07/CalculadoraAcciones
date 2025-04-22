import { ForexRequestModel } from '../schemas/forexRequest.schema.js';
import type { IForexRequest } from '../types/types.js';

export class ForexRequestService {
  async findAll() {
    try {
      return await ForexRequestModel.find();
    } catch (error) {
      return console.error('Error ForexRequestModel findAll: ', error);
    }
  }

  async findByID(id: string) {
    try {
      return await ForexRequestModel.findById(id);
    } catch (error) {
      return console.error('Error ForexRequestModel findByID: ', error);
    }
  }

  async create(request: IForexRequest) {
    try {
      const created = await ForexRequestModel.create(request);
      return created;
    } catch (error) {
      return console.error('Error ForexRequestModel create: ', error);
    }
  }

  async delete(id: string) {
    try {
      return await ForexRequestModel.findByIdAndDelete(id);
    } catch (error) {
      return console.error('Error ForexRequestModel delete: ', error);
    }
  }
}

export default new ForexRequestService();
