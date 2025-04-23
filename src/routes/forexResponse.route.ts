import { Router } from 'express';
import {
  findAllForexResponse,
  findByIDForexResponse,
  findByRequestIDForexResponse,
  createForexResponse,
  deleteForexResponse,
} from '../controllers/forexResponse.controller';

const responseRouter = Router();

responseRouter.get('/findall', findAllForexResponse);
responseRouter.get('/findbyid/:id', findByIDForexResponse);
responseRouter.get('/findbyrequestid/:id', findByRequestIDForexResponse);
responseRouter.post('/create', createForexResponse);
responseRouter.delete('/delete/:id', deleteForexResponse);

export default responseRouter;
