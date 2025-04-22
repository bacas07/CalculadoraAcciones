import { ForexResponseModel } from '../schemas/forexResponse.schema.js';
import type { ForexResponse } from '../types/types.js';

export default class ForexResponseServive {
  findAll = async () => {
    try {
    } catch (error) {
      return console.error('Error ForexResponseModel findAll: ', error);
    }
  };
}
