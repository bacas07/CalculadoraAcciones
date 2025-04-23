import { Router } from 'express';
import {
  findAllForexRequest,
  findByIDForexRequest,
  createForexRequest,
  deleteForexRequest,
} from '../controllers/forexRequest.controller';

const router = Router();

router.get('/findall', findAllForexRequest);
router.get('/findbyid/:id', findByIDForexRequest);
router.post('/create', createForexRequest);
router.delete('/delete/:id', deleteForexRequest);

export default router;
