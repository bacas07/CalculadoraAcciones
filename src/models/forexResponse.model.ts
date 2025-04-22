import { ForexResponseModel } from '../schemas/forexResponse.schema.js';
import type { IForexResponse } from '../types/types.js';

class ForexResponseServive {
  async findAll() {
    try {
      return await ForexResponseModel.find();
    } catch (error) {
      return console.error('Error ForexResponseModel findAll: ', error);
    }
  }

  async findByID(id: string) {
    try {
      return ForexResponseModel.findById(id);
    } catch (error) {
      return console.error('Error ForexResponseModel findByID: ', error);
    }
  }

  async findByRequestID(requestID: string) {
    try {
      return ForexResponseModel.find({ requestID });
    } catch (error) {
      return console.error('Error ForexResponseModel findByRequestID: ', error);
    }
  }

  async create(response: IForexResponse) {
    try {
      const created = await ForexResponseModel.create(response);
      return created;
    } catch (error) {
      return console.error('Error ForexResponseModel create: ', error);
    }
  }

  async delete(id: string) {
    try {
      return await ForexResponseModel.findByIdAndDelete(id);
    } catch (error) {
      return console.error('Error ForexResponseModel delete: ', error);
    }
  }
}

export default new ForexResponseServive();
