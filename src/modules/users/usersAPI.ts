import * as usersController from './usersController';
import { APIRouter, APIHelper } from '../../middleware/middlewareService';

const router = APIRouter();

router.post('/signup', (req, res) =>
  APIHelper({
    req,
    res,
    controller: usersController.signup,
  }),
);

router.post('/login', (req, res) =>
  APIHelper({
    req,
    res,
    controller: usersController.login,
  }),
);

export default router;
