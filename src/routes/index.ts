import { Router } from 'express';
import V1Router from './v1';
import * as slugsController from '../modules/slugs/slugsController';
import { APIHelper, rateLimiter } from '../middleware/middlewareService';

const router = Router();
router.use('/v1', V1Router);
router.get('/:slug', rateLimiter, (req, res) =>
  APIHelper({
    req,
    res,
    controller: slugsController.redirectUrl,
  }),
);

export default router;
