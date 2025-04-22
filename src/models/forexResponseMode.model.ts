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
}
