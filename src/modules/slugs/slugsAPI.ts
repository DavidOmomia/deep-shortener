import { Router } from 'express';
import * as slugsController from './slugsController';
import { authenticateUser, APIHelper, rateLimiter } from '../../middleware/middlewareService';

const router = Router();

router.post('/shorten', authenticateUser, (req, res) =>
  APIHelper({
    req,
    res,
    controller: slugsController.shortenUrl,
  }),
);

router.get('/', authenticateUser, (req, res) =>
  APIHelper({
    req,
    res,
    controller: slugsController.getUserUrls,
  }),
);

router.put('/modify', authenticateUser, (req, res) =>
  APIHelper({
    req,
    res,
    controller: slugsController.modifySlug,
  }),
);

router.delete('/:slug', authenticateUser, (req, res) =>
  APIHelper({
    req,
    res,
    controller: slugsController.deleteSlug,
  }),
);

export default router;
