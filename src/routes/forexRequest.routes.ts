import { Router } from 'express';
import {
  findAllForexRequest,
  findByIDForexRequest,
  createForexRequest,
  deleteForexRequest,
} from '../controllers/forexRequest.controller';

const requestRouter = Router();

requestRouter.get('/findall', findAllForexRequest);
requestRouter.get('/findbyid/:id', findByIDForexRequest);
requestRouter.post('/create', createForexRequest);
requestRouter.delete('/delete/:id', deleteForexRequest);

export default requestRouter;
